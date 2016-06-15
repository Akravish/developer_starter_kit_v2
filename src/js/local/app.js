$(document).ready(function () {
    // CONTACT LINK

    $('.mainContacts__link').on('click', function(e) {
        e.preventDefault();

        $('.mainContacts__wrapper').addClass('active');
    });

    $('.mainContacts__wrapper').on('click', function() {
        $(this).removeClass('active');
    });

    // FAQ LIST

    $('.faqQuestion__list').on('click', 'li', function() {
        $(this).find('.faqQuestion__desc').slideToggle('slow');
    });

    // FAQ FORM


    function sendSuccess($button){
        $button.val('Отправлено').addClass('success');

        setTimeout(function(){
            $button.val('Отправить').removeClass('success');
            $('.faqForm__capcha').click();
        },4000);
    }
    function sendError($button){
        $button.val('Ошибка').addClass('error');


        setTimeout(function(){
            $button.val('Отправить').removeClass('error');
            $('.faqForm__capcha').click();
        },4000);
    }

    $('.faqForm').on('submit', function(e) {

        e.preventDefault();

        var $form = $(this);

        console.log($form);
        console.log($form.serialize());

        var $button = $form.find('.faqForm__submit');

        var target = $form.attr('action');

        $.ajax({
            method: "POST",
            url   : target,
            data  : $form.serialize()
        }).done(function (data) {
            console.log(data);
            if (data === 'error') {
                sendError($button);
                return;
            }
            return sendSuccess($button);
        })
        .fail(function (data) {
            sendError($button);
            return console.log(data);
        });

    });

    // CAPCHA

    $('.faqForm__capcha').on('click', function(){
        $(this).attr('src', '/captcha/captcha.php?t=' + Math.random()).animate({opacity: 1}, 400);
    }).click();

    // HEADER TOGGLE

    $('.header-toggle').on('click', function() {
        $('.header-left-col, .header-right-col').slideToggle('fast');
    });


    $('.ms > img').each(function () {
        try {
            new Mosquito($(this), 'small', 2, function (mosquito) {
                mosquito.onAfterMove();
            });
        }
        catch (e) {
            console.log(e);
        }

    });

    $('#faq .mosquito').each(function () {
        try {
            new Mosquito($(this), 'small', 2, function (mosquito) {
                mosquito.onAfterMove();
            });
        }
        catch (e) {
            console.log(e);
        }


    });



    //scrollbar
    var $popup_scroll_parent = $('.product-description-content');
    if($popup_scroll_parent.length > 0){
        $('.js-scrollbar').scrollbar();


        $(window).resize(function(){
            $('.product-description-text-wrapper').each(function(){
                $(this).css({
                    height:
                        ($popup_scroll_parent.height() - ($popup_scroll_parent.find('h1').outerHeight(true) + $popup_scroll_parent.find('h2').outerHeight(true)))});

            });

        });
    }

    //---popup

    //close popup
    $('.product-description-close').on('click',function(e) {
        e.preventDefault();
        $('.product-description').removeClass('active');
        $('.product-description-overlay').removeClass('active');
        setTimeout(function(){
            $('.product-description-body').removeClass('active');
        },800);

    });


    //open popup
    $('.product-menu-item-list').on('click','li a',function(e){
        e.preventDefault();
        var product_id = $(this).attr('data-id');
        var $curr = $('.product-description-body').eq(product_id);

        $curr.addClass('active');

        setTimeout(function(){

            $curr.find('.product-description-text-wrapper').css({
                height:
                    ($curr.height() - ($curr.find('h1').outerHeight(true) + $curr.find('h2').outerHeight(true)))});


            $('.product-description').addClass('active');
            $('.product-description-overlay').addClass('active');

            console.log($curr.height());
            console.log($curr.find('h1').outerHeight(true));
            console.log($curr.find('h2').outerHeight(true));


        },800);




    });

    //next slide product
    $('.product-description').on('click','.product-description-next',function(e){
        e.preventDefault();
        var $parent = $(this).parent('.product-description'),
            $curr = $parent.find('.product-description-body.active');

        var product_len = $parent.find('.product-description-body').length,
            product_id_curr = parseInt($curr.attr('data-id')),
            product_id_next = product_id_curr + 1;

        $curr.removeClass('active');

        setTimeout(function(){
            if (product_id_next < product_len){
                var $next = $parent.find('.product-description-body').eq(product_id_next);
            }
            else{
                var $next = $parent.find('.product-description-body').eq(0);
            }
            $next.addClass('active');
            $next.find('.product-description-text-wrapper').css({
                height:
                    ($next.height() - ($next.find('h1').outerHeight(true) + $next.find('h2').outerHeight(true)))});

        },400);
    });



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