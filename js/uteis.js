// JavaScript Document
$(".externo").click(function(){window.open($(this).attr('href'));return false;});var title=document.title;var url=document.location.href;var lang=$("meta[name='language']").attr("content");var host=$("meta[name='so:host']").attr("content");var urlMidia=$("meta[name='so:urlMidia']").attr("content");var urlCSS=$("meta[name='so:urlCSS']").attr("content");var urlJS=$("meta[name='so:urlJS']").attr("content");var urlHELPERS=$("meta[name='so:urlHELPERS']").attr("content");var controller=$("meta[name='so:controller']").attr("content");var action=$("meta[name='so:action']").attr("content");




function empty(e) {
  if (e == null || e == 0 || e == "" || e == "") {
    return true
  } else {
    return false
  }
}

var validadeIt = function () {

  var handler = function () {


    $('form.validateIt').on("submit", function (e) {
      e.preventDefault();
      var $f = $(this);

      var $submit = $f.find('[type="submit"]');

      if ($submit.hasClass('disabled')) {
        return false;
      }

      if(!validate($f)){
        return false;
      }


      $f.find("form-group").removeClass("has-error");
      $f.children(".alert").fadeOut("fast");

      $submit.addClass('disabled');

      $.ajax({
        url: $f.attr('action'),
        method: 'post',
        data: $f.serialize(),
        dataType: 'json',
        success: function (data) {

          if(data.status){

            if($f.attr('data-cleanup')){
              cleanup($f);
              $f.find('[autofocus]').focus();
            }

            if($f.attr('data-addRow')){
              if(!empty(data.rows)){
                addRow($f, data.rows);
              }
            }

            if($f.attr('data-inserts')){
              $.each(data.inserts, function (index, value) {
                inserts(index, value);
              });
            }

          }

          printMsg(data.msg, data.status, $f);

          $submit.removeClass('disabled');
        }
      });

      return false;
    });


    function inserts(local, valor){
      var tag = $("#"+local);
      if(tag[0].tagName == 'INPUT'){
        tag.attr('value', valor);
      }else{
        tag.html(valor);
      }
    }

    function printMsg(e, t, n) {
      if (t == true) {
        t = 'success';
      } else {
        t = 'danger';
      }
      n.find(".alert").removeClass('alert-sucess').removeClass('alert-danger').removeClass("hidden");

      n.find(".alert").addClass('alert-'+t);
      n.find(".alert > p").html(e).fadeIn('fast');
    }

    function cleanup(id){
      id[0].reset();
    }

    function clear(){
      $('button.clear').click(function (e) {
        e.preventDefault();
        var $f = $(this).attr('data-campo');
        $($f).val('');
      });
    }

    function empty(e) {
      if (e == null || e == 0 || e == "" || e == "") {
        return true
      } else {
        return false
      }
    }

    function validate(e) {
      var t = 0;
      var n = "";

      $.each(e.serializeArray(), function(r, i) {
        n = e.children("[name='" + i.name + "']");
        if (n.attr("required")) {
          if (empty(i.value) || i.value == n.attr("placeholder")) {
            n.closest("form-group").addClass("has-error");
            t++
          } else {
            n.closest("form-group").removeClass("has-error");
            if (i.name == "email") {
              if (!email(i.value)) {
                n.closest("form-group").addClass("has-error");
                t++
              }
            }
          }
        }
      });

      if (t > 0) {
        printMsg("Preencha todos os campos.", "false", e);
        return false
      }
      return true
    }

    function email(e) {
      var t = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (!t.test(e)) {
        return false
      }
      return true
    }

    return {

      init: function (){
        handler();
        clear();
      }



    };
  }

}();

if (controller == 'contato') {
  google.maps.event.addDomListener(window, 'load', initMap);
  function initMap() {

    var mapElement = document.getElementById('mapa');

    var latitude = $('#mapa').attr('data-latitude');
    var longitude = $('#mapa').attr('data-longitude');
    var zoom = $('#mapa').attr('data-zoom');
    var titulo = $('#mapa').attr('data-titulo');

    var mapOptions = {

      zoom: 15,
      center: new google.maps.LatLng(latitude, longitude),
      scrollwheel: false,
      draggable: true,

        disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: false,
        zoomControl: false
      };

      var map = new google.maps.Map(mapElement, mapOptions);

      var image = $('#mapa').attr('data-marker');
      var myLatLng = new google.maps.LatLng(latitude, longitude);

      var infowindow = new google.maps.InfoWindow({
       content: $('#mapa').attr('data-content')
     });

      var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        title: titulo,

      });
      infowindow.open(map, beachMarker);

    }
  }

  function ajusteAltura(){
    var $alturaTela = $(window).height(); 
    var $alturaMenu = $('.topo') .height() + $('.menuNavBar').height();

    var $novaAltura = $alturaTela - $alturaMenu;

    if($novaAltura > 400){

      $('#myCarousel').css({
        'height': $novaAltura+'px'
      });
    }

  }



  function quadrado(){

    $('.quadrado').each(function(i){ 
      var $largura = $(this).width();
      $(this).height($largura); 
    }); 

  }

  $(document).ready(function($) {
    quadrado();
    ajusteAltura();

    var $lightbox = $('#lightbox');

    $('[data-target="#lightbox"]').on('click', function(event) {
      var $img = $(this).find('img'), 
      src = $img.attr('src'),
      alt = $img.attr('alt'),
      css = {
        'maxWidth': $(window).width() - 100,
        'maxHeight': $(window).height() - 100
      };

      $lightbox.find('.close').addClass('hidden');
      $lightbox.find('img').attr('src', src);
      $lightbox.find('img').attr('alt', alt);
      $lightbox.find('img').css(css);
    });

    $lightbox.on('shown.bs.modal', function (e) {
      var $img = $lightbox.find('img');

      $lightbox.find('.modal-dialog').css({'width': $img.width()});
      $lightbox.find('.close').removeClass('hidden');
    });


  });

  $(window).resize(function($) {
    ajusteAltura();
    quadrado();

  });


  $('.print').click(function(event) {
    event.preventDefault;

    var container = $(this).attr("data-container");

    var conteudo = $(document).find(container).html();
    tela_impressao = window.open('about:blank');
    tela_impressao.document.write(conteudo);
    tela_impressao.window.print();
    tela_impressao.window.close();


  });





  $('form.atuacao').on("submit", function (e) {
    e.preventDefault();
    var $f = $(this);

    var $submit = $f.find('[type="submit"]');

    if ($submit.hasClass('disabled')) {
      return false;
    }


    $('.cidadesServicos').html('<div class="container servicos"> <div class="row"> <div class="servico"> <div class="col-md-1"> <div class="simbolo quadrado meio text-center"> <i class="fa fa-spinner fa-spin fa-5x fa-fw"></i> </div></div><div class="col-md-11"> <h2 class="azul">Aguarde...</h2> <br/> </div><div class="clearfix"></div></div></div></div>');

    $submit.addClass('disabled');
    $('html, body').animate({
      scrollTop: $('.cidadesServicos').offset().top
    }, 500);

    $.ajax({
      url: $f.attr('action'),
      method: 'post',
      data: $f.serialize(),
      dataType : 'html',
      success: function (data) {

       $('.cidadesServicos').html(data).show(500);

       $submit.removeClass('disabled');
     }
   });

    return false;
  });

