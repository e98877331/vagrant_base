var oListFolderTable, oModGroupTable, oAddGroupTable;
var all_tag = true;

$(document).ready(function() {
  $("#volume").closest("li").addClass("active");
  $('.switch-mini').bootstrapSwitch();

  /*$('.dropdown-menu').on('click', function(e) {
    if($(this).hasClass('dropdown-menu-form')) {
        e.stopPropagation();
    }
  });*/

  var data_opt = {
    "sDom": "<'row-fluid'<'span8 toolbar'><'span4'f>><'row-fluid'<'span8'i><'span4 paginate_top'rp>><'row-fluid'<'span12't>><'row-fluid'<'span8'><'span4 paginate_bottom'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sSearch": "<div class='input-append'>_INPUT_<button class='btn btn-mini' disabled></button></div>",
        "sZeroRecords": __("empty_message"),
        "sInfo": __("group_information_message"),
        "sInfoEmpty": __("group_information_message"),
        "sInfoFiltered": ""
    },
    "bLengthChange": false,
    "iDisplayLength": 10,
    //"bSort": true,
    //"bInfo": false,
    //"bAutoWidth": false
    "asStripeClasses": [],
    "aoColumnDefs": [
      { "bSortable": true, "bSearchable": true, "aTargets": [ 1 ] },
      { "bSortable": false, "bSearchable": true, "aTargets": [ 2 ] },
      { "bSortable": false, "bSearchable": false, "aTargets": [ 0, 3 ] }
    ]
  };

  $.fn.popover.defaults.container = 'body';
  $.fn.popover.defaults.trigger = 'hover';
  $.fn.popover.defaults.placement = 'bottom';
  // Create main cifs groups with pagination
  cifs_group_dataTable = $("#table_cifs_groups").dataTable(data_opt);
  a = '<a data-toggle="popover" data-content="' + __('create_group_tooltip') +'" class="btn btn-icon btn-small btn-hopebay group-create"><span class="hopebay-icon btn-icon-add-group"></a>'
  b = '<a data-toggle="tooltip" title="'+ __("list_user_tooltip") +'" class="btn btn-icon btn-small btn-hopebay group-list"><span class="hopebay-icon btn-icon-user-list"></a>'
  $('div.toolbar').html(a);
  $("[data-toggle=popover]").popover();
  $("[data-toggle=popover]", cifs_group_dataTable.fnGetNodes()).popover()

  // Create user table with pagination
  data_opt["iDisplayLength"] = 6;
  data_opt['aoColumnDefs'] = [{ "bSearchable": true, "bSortable": false, "aTargets": [0, ] },
                              { "bSearchable": false, "bSortable": false, "aTargets": [1, 2] }]
  data_opt['oLanguage']['sInfo'] = __("user_information_message")
  data_opt['oLanguage']['sInfoEmpty'] = __("user_information_message")
  oModGroupTable = $("#table_mod_cifs_groups").dataTable(data_opt);
  $("#table_mod_cifs_groups_wrapper div.toolbar").html(b);
  oModGroupTable.dataTableExt.afnFiltering.push(
    function( settings, data, dataIndex ) {
      if (all_tag)
        return true

      if ($(oModGroupTable.fnGetNodes(dataIndex)).find('input[value=J]').prop('checked'))
        return true;

      return false
    }
  );
  oAddGroupTable = $('#table_add_cifs_groups').dataTable(data_opt);

  // Create folder table with pagination
  data_opt["aoColumnDefs"] = [{"bSortable": false, "aTargets": [1, ]}];
  data_opt['oLanguage']['sInfo'] = __("folder_information_message")
  data_opt['oLanguage']['sInfoEmpty'] = __("folder_information_message")
  oListFolderTable = $("#table_folder_cifs_groups").dataTable(data_opt);

  /*$("#create_group_button").click(function() {
      $('#modal-add-cifs-group').modal('toggle');
  });*/

  add_validator = $("#form-add-cifs-group").validate({
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    errorPlacement: function(error, element){
      element.after(error);
    },
    onkeyup: function(element){
      // Show submit button if form is valid
      add_validator.element(element);
      $('#add-cifs-group-submit').prop('disabled', !add_validator.checkForm());
    },
    onfocusout: function(element){
      // Show submit button if form is valid
      add_validator.element(element);
      $('#add-cifs-group-submit').prop('disabled', !add_validator.checkForm());
    },
    submitHandler: function(form) {
      loadingUI();
      $('#modal-add-cifs-group').modal('toggle');
      $(oAddGroupTable.fnGetNodes()).find('input:checked').appendTo($('#table_cifs_group_submit_add'))

      form.submit();
    },
    rules: {
      groupname: {
        required: true,
        groupname_check: true,
        minlength: 1,
        maxlength: 32,
      },
    },
    messages: {
    }
  });
  edit_validator = $("#form-mod-cifs-group").validate({
    onfocusout: false,
    highlight: function(label) {
      $(label).closest('.control-group').addClass('error');
    },
    success: function(label) {
      $(label).closest('.control-group').removeClass('error');
    },
    errorPlacement: function(error, element){
      element.after(error);
    },
    onclick: function(element){
      // Show submit button if form is valid
      $('#mod-cifs-group-submit').prop('disabled', false);
    },
    submitHandler: function(form) {
      loadingUI();
      $('#modal-mod-cifs-group').modal('toggle');
      $(oModGroupTable.fnGetNodes()).find('input:checked').appendTo($('#table_cifs_group_submit_mod'))

      form.submit();
    },
    rules: {
    },
    messages: {
    }
  });
  $('#form-mod-cifs-group input[type=text]').change(function(){
    console.log('123')
    $('#mod-cifs-group-submit').prop('disabled', false);
  });

  $('input:checkbox[name="purge"]').change(function(){
    if ($(this).prop("checked"))
      $("#del_btn").prop("disabled", false);
    else
      $("#del_btn").prop("disabled", true);
  });

  $(".modal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
  });

  // Button events
  $('.group-folder', cifs_group_dataTable.fnGetNodes()).click(function(){
    cifs_group_folder($(this).data('id'), $(this).data('domain'))
  });
  $('.group-modify', cifs_group_dataTable.fnGetNodes()).click(function(){
    cifs_group_modify($(this).data('id'), $(this).data('members'))
  });
  $('.group-delete', cifs_group_dataTable.fnGetNodes()).click(function(){
    cifs_group_delete($(this).data('id'))
  });
  $('.group-create').click(function(){
    cifs_group_create();
  });
  $('.group-list').click(function(){
    cifs_group_modify_all();
  });
});

function cifs_group_modify_all(){
  all_tag = true;
  oModGroupTable.fnDraw();
}

function cifs_group_create() {
  add_validator.resetForm();
  $('#add-cifs-group-submit').prop('disabled', true);
  $('#modal-add-cifs-group .control-group').removeClass('error');
  $('#modal-add-cifs-group input[value=L]').prop('checked', true);
  $('#modal-add-cifs-group input[type=text]').val('');

  $('#modal-add-cifs-group').modal({ backdrop: 'static', keyboard: true });
}

function cifs_group_delete(group_name) {
  $('input:checkbox[name="purge"]').prop("checked", false);
  $("#del_btn").prop("disabled", true);

  $("#modal-del-cifs-group .modal-body p b").text(group_name);
  $('#modal_del_group_name').val(group_name);
  $('#modal-del-cifs-group').modal({ backdrop: 'static', keyboard: true });
}

function cifs_group_modify(group_name, members) {
  // String to array
  if (members.length != 0)
    members_list = members.replace(/[ \[\]'(u')]/g,'').split(',')
  else
    members_list = []

  $('#mod-cifs-group-submit').prop('disabled', true);
  $('#modal-mod-cifs-group input[type=text]').val('');
  $('#modal_mod_group_name').val(group_name)

  var oSettings = oModGroupTable.fnSettings();
  oSettings._iDisplayLength = oModGroupTable.fnGetData().length;
  all_tag = true;
  oModGroupTable.fnDraw();
  $('#table_mod_cifs_groups input[value=L]').prop("checked", true);
  $.each(members_list, function(index, name) {
    $('#table_mod_cifs_groups input[id=user_'+name+'_J'+']').prop("checked", true);
  });
  oSettings._iDisplayLength = 6;
  all_tag = false;
  oModGroupTable.fnDraw();

  // Set modal
  $('#modal-mod-cifs-group').modal({ backdrop: 'static', keyboard: true });
}

function cifs_group_folder(group_name, domain) {
  $("#modal-folder-cifs-group h3").text(__("folder_list") + group_name);

  $.ajax({
      url: __("volume_cifs_group_info"),
      type: "POST",
      data: {"groupname": group_name, "domain": domain},
      success: function(data) {
        var oSettings = oListFolderTable.fnSettings();
        oListFolderTable.fnClearTable();
        var oldData = oListFolderTable.fnGetData();

        $.each(data["permissions"], function(index, folder) {
          if (folder['perm'] != null)
            oListFolderTable.fnAddData([[folder['name'], folder['perm']]]);
        });

        oListFolderTable.fnAddData(oldData);
        oSettings._iDisplayLength = 6;
        oListFolderTable.fnDraw();
      }
  });

  $('#modal-folder-cifs-group').modal({ backdrop: 'static', keyboard: true });
}

