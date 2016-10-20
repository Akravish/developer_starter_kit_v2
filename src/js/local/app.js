$(document).ready(function () {
    // CONTACT LINK

    let temp=6;

    //prev slide product
    $('.product-description').on('click','.product-description-prev',function(e){
        e.preventDefault();
        var $parent = $(this).parent('.product-description'),
            $curr = $parent.find('.product-description-body.active');

        var product_len = $parent.find('.product-description-body').length,
            product_id_curr = parseInt($curr.attr('data-id')),
            product_id_prev = product_id_curr - 1;

        $curr.removeClass('active');

        setTimeout(function(){
            if (product_id_prev > -1){
                var $prev = $parent.find('.product-description-body').eq(product_id_prev);
            }
            else{
                var $prev = $parent.find('.product-description-body').eq(product_len-1);
            }

            $prev.addClass('active');
            $prev.find('.product-description-text-wrapper').css({
                height:
                    ($prev.height() - ($prev.find('h1').outerHeight(true) + $prev.find('h2').outerHeight(true)))});




            console.log($prev.outerHeight(true));
            console.log($prev.find('h1').outerHeight(true));
            console.log($prev.find('h2').outerHeight(true));


        },400);
    });

});