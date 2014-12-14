$(document).ready(function() {
  var form_iou = $('#form_iou_update').validate({
    /*highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    submitHandler: function(form) {
      console.log('test');
      return false;
      form.submit();
    },*/
    errorLabelContainer: "#errors",
    rules: {
      action: {
        required: true,
      },
      target_name: {
        required: true,
      },
      value: {
        required: true,
        min: 1,
      },
    },
  });
    /*$('#confirm_filter').click(function(){
        $('.borrow').hide()
        $('.lend').hide()
        $('.event').show()
    });
    $('#lend_filter').click(function(){
        $('.borrow').hide()
        $('.lend').show()
        $('.event').hide()
    });
    $('#borrow_filter').click(function(){
        $('.borrow').show()
        $('.lend').hide()
        $('.event').hide()
    });*/
});

function update_iou(target_name){
  if ( target_name != null){
    $('#iou-modal input[name="target_name"]').prop('readonly', true)
    $('#iou-modal input[name="target_name"]').val(target_name);
  }
  else{
    $('#iou-modal input[name="target_name"]').prop('readonly', false)
    $('#iou-modal input[name="target_name"]').val('');
  }

  $('#iou-modal').modal('show');
};

function confirm_iou(event_id){
  $('#confirm-modal input[name="event_id"]').val(event_id);

  $('#confirm-modal').modal('show');
};
