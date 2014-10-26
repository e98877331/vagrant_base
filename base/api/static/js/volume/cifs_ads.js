/*$.fn.popover.defaults.container = 'body';
$.fn.popover.defaults.trigger = 'hover';
$.fn.popover.defaults.placement = 'bottom';*/

$(document).ready(function() {
    $("#volume").closest("li").addClass("active");
    $('#ad_enabled').bootstrapSwitch();

    // Switch event
    if (__('starter_mode') == 'True'){
      // Add tooltip
      $("button[type='submit'], input[type=text], input[type=password], #ad_enabled").attr('data-toggle', 'tooltip');
      $("button[type='submit'], input[type=text], input[type=password], #ad_enabled").attr('title', __('starter_msg'));
      /*$('input[type=text]').popover({
        'container': 'body',
        'content': 'Starter version do not support AD.',
        'trigger': 'hover',
      });*/

      // Disable all input and switch
      $('input[type=text], input[type=password]').prop('disabled', true);
      $('#ad_enabled').bootstrapSwitch('setDisabled', true);
    }
    else{
      // Set input default prop
      $('input[type=text], input[type=password]').prop('disabled', $('#ad_enabled').bootstrapSwitch('state'));
      if (__("form_valid") == "True")
        $('#ad_enabled').bootstrapSwitch('setDisabled', false);
      else
        $('#ad_enabled').bootstrapSwitch('setDisabled', true);

      $('#ad_enabled').on('switch-change', function(){
        loadingUI();
        $.post(
          __("volume_cifs_ads_toggle"),
          {'enabled': $(this).prop('checked')}
        )
        .done(function(data){
          $.unblockUI();
          if (data["result"]){
            toastr.success(data["msg"]);
            $('input[type=text], input[type=password]').prop('disabled', $('#ad_enabled').bootstrapSwitch('state'));
          }
          else
            toastr.error(data["msg"]);
        });
      });

      $("input").keypress(function(){
        $("button[type='submit']").prop("disabled", false);
        $('#ad_enabled').bootstrapSwitch('setDisabled', true);
        $("input").unbind('keypress');
      });
    }
});
