$(document).ready(function() {
    const myFooterA = $('.my-footer a');
    // console.log(myFooterA);
    for (let i = 0; i < myFooterA.length; i++) {
        // https://api.jquery.com/eq/
        var e = myFooterA.eq(i);
        // console.log(typeof(e));
        // console.log(e);
        console.log(e[0]);
        e.addClass('text-decoration-none');
    }
});