var cifs_perms_dataTables = { 'add': {}, 'mod': {}};
//var cifs_add_dataTable, cifs_mod_dataTable;
var permission_list = ['RW', 'RO', 'DE'];
$.fn.popover.defaults.container = 'body';
$.fn.popover.defaults.trigger = 'hover';
$.fn.popover.defaults.placement = 'bottom';

$.resetModal = function() {
  $("#form-add-cifs").find('input[type=text], input[type=password], textarea').val('');
  $("#form-add-cifs").find('input[type=checkbox]').prop('checked', false);
};

$.resetEditingModal = function() {
  $("#form-edit-cifs").find('input[type=text], input[type=password], textarea').val('');
};

function createTable(modalType, data_opt, toolbar, bottom_toolbar){
  $('#modal-' + modalType + '-cifs table').each(function(){
    table_id = $(this).attr('id')
    // Create if it wasn't init
    if (cifs_perms_dataTables[modalType][table_id] == undefined){
      cifs_perms_dataTables[modalType][table_id] = $('#' + table_id).dataTable(data_opt);
      $('#' + table_id + '_wrapper div.toolbar').html(toolbar);
      $('#' + table_id + '_wrapper div.bottom_toolbar').html(bottom_toolbar);

      // Highlight its tab
      tab_class = 'btn-icon-' + table_id.split('_')[2]
      $('#' + table_id + '_wrapper div.toolbar .' + tab_class).closest('a').addClass('btn-primary');
    }
    // Clean add table if it has init
    else{
      if (modalType == 'add')
        active_num = $('input', cifs_perms_dataTables[modalType][table_id].fnGetNodes()).prop('checked', false);
    }
  })
}
function showTable(modalType, tableType){
  /* Show dedicated table (tableType) and hide the others */

  //
  table_id = '#table_cifs_' + tableType + '_' + modalType

  // Hide all others, and show dedicated one
  $.each(cifs_perms_dataTables[modalType], function( index, dataTable ) {
    $('#' + index + '_wrapper').hide()
  });

  $(table_id+'_wrapper').show();

  calculateCounters(modalType);
};


function calculateCounters(modalType){
  /* calculate RW/RO counters */
  $.each(cifs_perms_dataTables[modalType], function(index, dataTable){
    // Update headers
    total_count = dataTable.fnGetNodes().length;
    for (var i=0; i< permission_list.length; i++){
      current_count = $('input[value='+ permission_list[i] +']:checked', cifs_perms_dataTables[modalType][index].fnGetNodes()).length;
      if (current_count == total_count && total_count != 0)
        $('#' + index + ' th input[value='+  permission_list[i] +']').prop('checked', true);
      else
        $('#' + index + ' th input[value='+  permission_list[i] +']').prop('checked', false);
    }
    
    // Calculate Counters
    total_count = cifs_perms_dataTables[modalType][index].fnGetNodes().length;
    table_type = index.split('_')[2]
    counter_id = '#' + table_type + '_' + modalType + ' p'

    // Update counters
    active_num = $('input[value!=DE]:checked', cifs_perms_dataTables[modalType][index].fnGetNodes()).length;
    $(counter_id).html('(' + active_num + ')');
    $(counter_id).attr('data-toggle', 'tooltip');
    $(counter_id).attr('title', __("switch_tab_tooltip"));
    /*$(counter_id).popover({
        'html': true, 
        'content': '<span style="color:#333333">' + __("switch_tab_tooltip") + '</span>',
    });*/
  });
};

function initEditTable(permissionItem, permissionType){
    user_id = '';
    if (permissionItem['domain'])
      user_id += 'ad';

    table_id = 'table_cifs_' + user_id + permissionItem['type'] + 's_mod'
    user_id = user_id + permissionItem['type'] + '_' + permissionItem['name'];

    $('input[name="' + user_id + '"][value=' + permissionType + ']', cifs_perms_dataTables['mod'][table_id].fnGetNodes()).prop('checked', true);
}

$(document).ready(function() {

  var csrftoken = getCookie('csrftoken');

  var data_opt = {
    "sDom": "<'row-fluid'<'span8 toolbar'><'span4'f>><'row-fluid'<'span7 other_toolbar'i><'span5 paginate_top'rp>><'row-fluid'<'span12't>><'row-fluid'<'span7 bottom_toolbar'><'span5 paginate_bottom'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sSearch": "<div class='input-append'>_INPUT_<button class='btn btn-mini' disabled></button></div>",
        "sZeroRecords": __("empty_message"),
        "sInfo": __("information_message"),
        "sInfoEmpty": __("information_message"),
        "sInfoFiltered": ""
    },
    "iDisplayLength": 10,
    "bInfo": true,
    "bDestroy": true,
    "asStripeClasses": [],
    "aoColumnDefs": [
        {"bSortable": true, "bSearchable": true, "aTargets": [1]},
        {"bSortable": true, "bSearchable": false, "aTargets": [2]},
        {"bSortable": false, "bSearchable": false, "aTargets": [0, 3, 4]}
    ],
  };

  $("#volume").closest("li").addClass("active");
  // Trigger bootstrap components
  $('.switch-mini').bootstrapSwitch();
  // Create cifs main table with pagination
  folder_dataTable = $('#cifs_export').dataTable(data_opt);
  a = '<a id="cifs-create-btn" class="btn btn-icon btn-small btn-hopebay"><span class="hopebay-icon btn-icon-add-folder"></a>'
  $('div.toolbar').html(a);
  // Trigger popover
  $("[data-toggle=popover]").popover()
  $("[data-toggle=popover]", folder_dataTable.fnGetNodes()).popover()

  b = [
    '<div class="row-fluid">',
    '<div id="add-btn-group" class="btn-group">',
    '<a id="users_add" class="btn btn-small"><span class="hopebay-btn-group btn-icon-users"><p></p></span></a>',
    '<a id="groups_add" class="btn btn-small"><span class="hopebay-btn-group btn-icon-groups"><p></p></span></a>',
    '<a id="adusers_add" class="btn btn-small"><span class="hopebay-btn-group btn-icon-adusers"><p></p></span></a>',
    '<a id="adgroups_add" class="btn btn-small"><span class="hopebay-btn-group btn-icon-adgroups"><p></p></span></a>',
    '</div></div>' ].join('\n');

  c = [
    '<div class="row-fluid">',
    '<div id="mod-btn-group" class="btn-group">',
    '<a id="users_mod" class="btn btn-small"><span class="hopebay-btn-group btn-icon-users"><p></p></span></a>',
    '<a id="groups_mod" class="btn btn-small"><span class="hopebay-btn-group btn-icon-groups"><p></p></span></a>',
    '<a id="adusers_mod" class="btn btn-small"><span class="hopebay-btn-group btn-icon-adusers"><p></p></span></a>',
    '<a id="adgroups_mod" class="btn btn-small"><span class="hopebay-btn-group btn-icon-adgroups"><p></p></span></a>',
    '</div></div>' ].join('\n');

  d = '<div class="row-fluid"><p style="margin-bottom: 0px;margin-top: 13px">'+ __("perms_message") +' </p></div>'

  // Setting the rest table
  data_opt['bInfo'] = false;
  data_opt['iDisplayLength'] = 6;
  data_opt['aoColumnDefs'] = [
    { "bSortable": false, "bSearchable": true, "aTargets": [ 0 ] },
    { "bSortable": false, "bSearchable": false, "aTargets": [1, 2, 3] },
  ]

  $("#folder_dialog").dialog({
    autoOpen: false,
    width: 500,
    resizable: false,
    closeText: "",
    modal: true
  });
 
  $.ajaxSetup({
    crossDomain: false,
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type)) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });

  $('.switch-mini', folder_dataTable.fnGetNodes()).on('switch-change', function (e, data) {
    loadingUI();
    var folder_name = $(this).data('id');
    $.post(
      __("volume_cifs_toggle"),
      {"folder_name": folder_name}
    )
    .done(function(data){
      $.unblockUI();
      if (data["result"]) {
        toastr.success(data["msg"]);
      }
      else {
        toastr.error(data["msg"]);
      }
    });
  });

  var form_validator = $('#form-add-cifs').validate({
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    onkeyup: function(element){
      form_validator.element(element)
      $('#add-cifs-submit').prop('disabled', !form_validator.checkForm());
    },
    onfocusout: function(element){
      form_validator.element(element)
      $('#add-cifs-submit').prop('disabled', !form_validator.checkForm());
    },
    submitHandler: function(form) {
      $("#modal-add-cifs").modal('hide');
      $.each(cifs_perms_dataTables['add'], function(index, dataTable){
        $(dataTable.fnGetNodes()).find('input:checked').appendTo($('#table_cifs_submit_add'))
      });
      form.submit();
    },
  });
  var edit_form_validator = $('#form-edit-cifs').validate({
    onfocusout: false,
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    onclick: function(){
      $('#edit-cifs-submit').prop('disabled', false);
    },
    submitHandler: function(form) {
      $("#modal-mod-cifs").modal('hide');
      $.each(cifs_perms_dataTables['mod'], function(index, dataTable){
        $(dataTable.fnGetNodes()).find('input:checked').appendTo($('#table_cifs_submit_mod'))
      });
      form.submit();
    },
  });
  
  $(".modal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
  });

  $("#modal-add-cifs").on('hidden', function() {
    $.resetModal();
    form_validator.resetForm();
  });

  $("#modal-mod-cifs").on('hidden', function() {
    $.resetEditingModal(); 
    edit_form_validator.resetForm();
  });
  

  if (mode == "starter" && parseInt(cur_folders) >= parseInt(max_folders)) {
    $("#cifs-create-btn").attr('disabled', 'disabled');
    $("#cifs-create-btn").click(function() { return false; } );
    $("#cifs-create-btn").popover({
      content: __("folder_limit"),
    });
  } else {
    $("#cifs-create-btn").popover({
      content: __('create_folder_tooltip'),
    });
    $("#cifs-create-btn").click(function(){
      // Initial dataTable, and set default table as users
      createTable('add', data_opt, b, d)
      showTable('add', 'users');
      $('#add-cifs-submit').prop('disabled', true);
      $('#modal-add-cifs').modal({ backdrop: 'static', keyboard: true });
    });
  }

  $("#add-cifs-submit").click(function(){
    if (form_validator.form()) {
      loadingUI();
    }
  });

  $("#edit-cifs-submit").click(function(){
    if (edit_form_validator.form()) {
      loadingUI();
    }
  });

  $("#form-remove-cifs").submit(function() {
    $('#modal-delete-cifs').modal('toggle');
    loadingUI();
  });

  // bind delete button to folder
  $(".delete-dialog-btn", folder_dataTable.fnGetNodes()).click(function(){
    if ( $(this).data('for_nas') == 'True'){
      $('#modal-alert-nas').modal({ backdrop: 'static', keyboard: true });
    }
    else if ( $(this).data('for_rsync') == 'True' ){
      $('#modal-alert-rsync').modal({ backdrop: 'static', keyboard: true });
    }
    else {
      $('input:checkbox[name="purge"]').prop("checked", false);
      $(".delete-btn").prop("disabled", true);
      var folder_name = $(this).data('id');
      $(".modal-body #delete-target").val(folder_name);
      $("#modal-delete-cifs .modal-body p b").text(folder_name);

      $('#modal-delete-cifs').modal({ backdrop: 'static', keyboard: true });
    }
  });

  $(".edit-dialog-btn", folder_dataTable.fnGetNodes()).click(function(){
    var folder_name = $(this).data('id');
    var readonly = $(this).data('readonly');

    $(".modal-body #modal_edit_folder_name").val(folder_name);
    createTable('mod', data_opt, c, d)
    // Uncheck all checkbox first
    $.each(cifs_perms_dataTables['mod'], function(index, dataTable){
      $('input[type=checkbox]', dataTable.fnGetNodes()).prop('checked', false);
      // Disabled all RW checkbox if the folder is from rsync or nas backup
      if (readonly == "1"){
        $('input[type=checkbox][value=RW]', dataTable.fnGetNodes()).prop('disabled', true);
        $('#modal-mod-cifs th input[type=checkbox][value=RW]').prop('disabled', true)
      }
      else {
        $('input[type=checkbox][value=RW]', dataTable.fnGetNodes()).prop('disabled', false);
        $('#modal-mod-cifs th input[type=checkbox][value=RW]').prop('disabled', false)
      }
    });
    // Get previous data
    $.ajax({
      url: "/volume/cifs/info",
      type: "POST",
      data: {"folder_name": folder_name},
      success: function(data) {
        if (data['result']){
          for (var i=0; i< data['data']['invalid_list'].length; i++)
            initEditTable(data['data']['invalid_list'][i], 'DE')
          for (var i=0; i< data['data']['read_only_list'].length; i++)
            initEditTable(data['data']['read_only_list'][i], 'RO')
          for (var i=0; i< data['data']['read_write_list'].length; i++)
            initEditTable(data['data']['read_write_list'][i], 'RW')
        }
      },
      complete: function(){
        // Initial dataTable, and set default table as users
        showTable('mod', 'users');
        $('#edit-cifs-submit').prop('disabled', true);
      }
    });

    $('#modal-mod-cifs').modal({ backdrop: 'static', keyboard: true });
  });

  $(".folder_link", folder_dataTable.fnGetNodes()).click(function(){
    var folder_name = $(this).data('id');
    $("#folder_path").val( __("cifs_ip") + folder_name);
    $("#folder_path_mac").val( __("mac_smb_ip") + folder_name);
    $("#full_path").text(folder_name);
    $("#folder_dialog").dialog("open");
  });
  
  $('input:checkbox[name="purge"]').change(function(){
    if ($(this).prop("checked"))
      $(".delete-btn").prop("disabled", false);
    else
      $(".delete-btn").prop("disabled", true);
  });

  // Switch tables of crating shared folder modal
  $( document ).on( "click", "#modal-add-cifs .btn-group .btn", function() {
    showTable('add', $(this).attr('id').split('_')[0])
  });

  // Switch tables of editing shared folder modal
  $( document ).on( "click", "#modal-mod-cifs .btn-group .btn", function() {
    showTable('mod', $(this).attr('id').split('_')[0])
  });

  // All checkbox change event
  $("input:checkbox").on('click', function(e){
    checkname = $(this).attr('name');
    wasChecked = $(this).prop('checked');
    selector = "input[name=\"" + checkname + "\"]:checked"
    $(selector).removeAttr("checked");
    if (wasChecked)
      $(this).prop('checked', true);
  });

  // tbody checkbox change event
  $(".modal td input:checkbox").on('click', function(e){
    // Cancel checked of header checkbox
    table_id = $(this).closest('table').attr('id');
    modal_type = $(this).closest('.modal').attr('id').split('-')[1];

    $('#' + table_id + ' th input:checkbox').prop('checked', false);

    calculateCounters(modal_type);
  });

  // theader checkbox change event
  $(".modal th input:checkbox").on('click', function(e){
    cb_select = this;
    cb_checked = $(cb_select).prop('checked');
    e.preventDefault();

    confirm_dialog('<i class="fa fa-exclamation-triangle"></i>' + __('warn_title'), __('apply_all'), function(result){
      table_id = $(cb_select).closest('table').attr('id');
      modal_type = $(cb_select).closest('.modal').attr('id').split('-')[1];
      if (result) {
        if (!cb_checked)
          $('input[value='+ $(cb_select).val() +']', cifs_perms_dataTables[modal_type][table_id].fnGetNodes()).prop('checked', false);
        else
          for (var i=0; i< permission_list.length;i++)
            if (permission_list[i] == $(cb_select).val())
              $('input[value='+ $(cb_select).val() +']', cifs_perms_dataTables[modal_type][table_id].fnGetNodes()).prop('checked', true);
            else
              $('input[value='+ permission_list[i] +']', cifs_perms_dataTables[modal_type][table_id].fnGetNodes()).prop('checked', false);

        $(cb_select).prop('checked', cb_checked);
      }
      // calculate RW/RO counters, depended by confirm box
      calculateCounters(modal_type)
    });
  });

});
    
ZeroClipboard.config({ moviePath: "/static/components/zeroclipboard/ZeroClipboard.swf" });

var client_win = new ZeroClipboard( $("#copy-button-win") );
var client_mac = new ZeroClipboard( $("#copy-button-mac") );

client_win.on( 'wrongflash noflash', function() {
    ZeroClipboard.destroy();
    $("#copy-button-win").hide();
}); 
client_mac.on( 'wrongflash noflash', function() {
    ZeroClipboard.destroy();
    $("#copy-button-mac").hide();
});

if (/MSIE|Trident/.test(window.navigator.userAgent)) {
  (function($) {
    $.widget( "ui.dialog", $.ui.dialog, {
      _allowInteraction: function( event ) {
        return this._super(event) || $( event.target ).closest( ".global-zeroclipboard-container" ).length;
      }
    } );
  })(window.jQuery);
;}
