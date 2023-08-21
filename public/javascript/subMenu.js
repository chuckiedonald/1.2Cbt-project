
function subMenu(a,b,c,d){
   let x = "."+a;
   let v = "."+b;
   let i = "."+c;
   let s = "."+d;
   $(x).click(function(){
    $(v).toggleClass("hide");
    $(i).toggleClass("hide");
    $(s).toggleClass("hide")
})
}

subMenu('sub1','open1','closed1','sub-t-1');
subMenu('sub2','open2','closed2','sub-t-2');
subMenu('sub3','open3','closed3','sub-t-3');