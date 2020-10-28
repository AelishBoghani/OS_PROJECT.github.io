let s = $("#data").html();
let s_animate = $("#animateAll").html();
$(document).ready(function () {
    
    let arrival = [];
    let burst = [];
    let Completion = [];
    let tat = [];
    let wt = [];
    let arrival_process = [];
    let queue=[];
    let flg=0;
    let fin_burst=[];
    //when add buttton clicked then animation and data in the row are deleted.
    function deleteOther() {
        $("#data").html(s);
        $("#animateAll").html(s_animate);
        makeHide();
    }

    //makevisible other column
    function makeVisible() {
        $(".ans").css("visibility", "visible");
        $(".avg").css("visibility", "visible");
    }

    //Add process
    let lst=1;
    $("#add").click(function () {
        let n = $("#process").val();
        deleteOther();
        for (let i = 1; i < n; i++) {
            $("#data").append(s);
            $("#data .cen").eq(i * 3).text(i);
            lst=i+1;
        }
    });
    
    $("#add_row").click(function(){
        let n=$("#process").val();
        $("#process").val(parseInt(n)+1);
        $("#data").append(s);
        $("#data .cen").eq(lst * 3).text(lst);
        lst++;
    });

    $("#delete_row").click(function(){
        lst--;
        if(lst<0)
        {
            lst=0;
            return;
        }
        $("#process").val(lst);
        $("#data").children(".cen").eq(lst*3+2).remove();
        $("#data").children(".cen").eq(lst*3+1).remove();
        $("#data").children(".cen").eq(lst*3).remove();
        $("#data").children(".ans").eq(lst*3+2).remove();
        $("#data").children(".ans").eq(lst*3+1).remove();
        $("#data").children(".ans").eq(lst*3).remove();
    });
    
    //select process
    function addQueue(last)
    {
        let n=lst;
        for(let i=flg;i<n && arrival_process[i][0]<=last;i++)
        {
            // console.log(flg+" "+i);
            queue.push(arrival_process[i][1]);
            flg++;
        }
    }

    function select_process(till)
    {
        let n =lst;
        let max=-1,select=-1;
        //console.log(till);
        for(let i=0;i<queue.length;i++)
        {
            if(burst[queue[i]]!=0 && max<burst[queue[i]])
            {
                max=burst[queue[i]];
                select=queue[i];
            }
        }
        //console.log();
        if(max==-1 && flg==n)
        {
            return -2;
        }
        else if(select==-1)
        {
            return -1;
        }
        else 
        {    
            return select;
        }
    }

    //Animation function
    function fun_animation() {
        let n = lst;

        let last = 0;
        let i = -1;
        let j;
        flg=0;
        while (1) {
            addQueue(last);
            j=select_process(last);
            //console.log(j);
            //console.log(last);
            if(j==-2)
            {
                break;
            }
            else if (j==-1){
                i++;
                $("#animateAll").append(s_animate);
                $(".animation").eq(i).css("visibility", "visible");
                $(".animation").eq(i).text("Waste");
                $(".animation").eq(i).css("background-color", "black");
                $(".animation").eq(i).css("color", "white");
                $(".start").eq(i).text(last);
                let next_arrive=arrival_process[flg][0];
                let cur = 50 * (next_arrive - last);
                $(".animation").eq(i).animate({
                    width: cur
                }, 500);
                last = next_arrive;
                continue;
            }
            let cur = 50;
            i++;
            $("#animateAll").append(s_animate);
            $(".animation").eq(i).css("visibility", "visible");
            $(".animation").eq(i).text("P" + j);
            $(".start").eq(i).text(last);
            
            if (i % 2)
            $(".animation").eq(i).css("background-color", "lightblue");
            else
            $(".animation").eq(i).css("background-color", "red");
            
            $(".animation").eq(i).animate({
                width: cur
            }, 1000);
            last = last + 1;
            burst[j]=burst[j]-1;
            if(burst[j]==0)
                Completion[j]=last;
        }
        i++;
        $("#animateAll").append(s_animate);
        $(".start").eq(i).text(last);
    }

    //algorithm
    $("#compute").click(function () {
        let n = lst;
        let texts = $(".cen").map(function () {
            return $(this).val();
        }).get();
        console.log(texts);

        makeAnimationHide();

        arrival.length = 0;
        burst.length = 0;
        arrival_process.length=0;
        queue.length=0;
        fin_burst.length=0;

        for (let i = 0; i < texts.length; i++) {
            if (i % 3 == 0)
                continue;
            else if (i % 3 == 1) {
                if (texts[i] == "") {
                    alert("Enter number");
                    makeHide();
                    return;
                }
                arrival.push(parseInt(texts[i]));
                arrival_process.push([parseInt(texts[i]),parseInt( arrival_process.length)]);
            }
            else {
                if (texts[i] == "") {
                    alert("Enter number");
                    makeHide();
                    return;
                }
                burst.push(parseInt(texts[i]));
                fin_burst.push(parseInt(texts[i]));
            }
        }
        // console.log(process);
        console.log(arrival);
        console.log(burst);
        Completion.length = n;
        wt.length = n;
        tat.length = n;
        arrival_process = arrival_process.sort(function (a, b) {  return a[0] - b[0]; });
        //compute Completion time
        // for(let i=0;i<arrival_burst.length;i++)
        // {
        //      console.log(arrival_burst[i][0]+" "+arrival_burst[i][1]);
        // }

        fun_animation();

        let count = 0;
        //compute Turn Around Time and Waiting Time
        while (count < n) {
           // console.log(Completion[count]);
            tat[count] = Completion[count] - arrival[count];
            console.log(count);
            wt[count] = tat[count] - fin_burst[count];
            count++;
        }

        console.log(Completion);
        console.log(tat);
        console.log(wt);

        //give value to our html table
        var avg_tat=0,avg_wat=0;
        for (let i = 0, j = 0; i < 3 * n; i += 3, j++) {
            $("#data .ans").eq(i).text(Completion[j]);
            $("#data .ans").eq(i + 1).text(tat[j]);
            $("#data .ans").eq(i + 2).text(wt[j]);
            avg_tat+=tat[j];
            avg_wat+=wt[j];
        }

        $("#avg_tat").text(Math.round(avg_tat/n*100)/100);
        $("#avg_wat").text(Math.round(avg_wat/n*100)/100);

        makeVisible();

    });

    function makeAnimationHide()
    {
        $(".animation").css("width", 0);
        $(".animation").css("color", "black");
        $(".animation").text("");
        $(".start").text("");
    }

    //this function make hide and give the text to null
    function makeHide() {
        $(".cen").val("");
        $(".ans").css("visibility", "hidden");
        $(".avg").css("visibility", "hidden");
        // $(".animation").css("visibility","hidden");
        makeAnimationHide();
    }

    //reset the button
    $("#reset").click(makeHide);

});
