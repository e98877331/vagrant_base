var add_validator, passwd_validator;
var oListUserTable, oAddUserTable, oModUserTable, oListFolderTable;
var all_tag = true;

$(document).ready(function() {
  $("#volume").closest("li").addClass("active");
  // Trigger bootstrap componments
  $('.switch-mini').bootstrapSwitch();

  /*$('.dropdown-menu').on('click', function(e) {
    if($(this).hasClass('dropdown-menu-form')) {
        e.stopPropagation();
    }
  });*/

   // 4 column, first and last can't be sortable and searchable
  var data_opt = {
    "sDom": "<'row-fluid'<'span8 toolbar'><'span4'f>><'row-fluid'<'span8'i><'span4 paginate_top'rp>><'row-fluid'<'span12't>><'row-fluid'<'span8'><'span4 paginate_bottom'p>>",
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sSearch": "<div class='input-append'>_INPUT_<button class='btn btn-mini' disabled></button></div>",
        "sZeroRecords": __("empty_message"),
        "sInfo": __("user_information_message"),
        "sInfoEmpty": __("user_information_message"),
        "sInfoFiltered": ""
    },
    "iDisplayLength": 10,
    "asStripeClasses": [],
    "aoColumnDefs": [
        { "bSortable": true, "bSearchable": true, "aTargets": [ 1, 2 ] },
        { "bSortable": false, "bSearchable": false, "aTargets": [ 0, 3 ] }
    ],
  }; 

  $.fn.popover.defaults.container = 'body';
  $.fn.popover.defaults.trigger = 'hover';
  $.fn.popover.defaults.placement = 'bottom';
  // Main table with pagination
  oListUserTable = $("#table_cifs_users").dataTable(data_opt);
  a = '<a data-toggle="popover" data-content="'+ __('create_user_tooltip') +'" class="btn btn-icon btn-small btn-hopebay user-create"><span class="hopebay-icon btn-icon-add-user"></a>'
  b = '<a data-toggle="tooltip" title="'+ __("list_group_tooltip") +'" class="btn btn-icon btn-small btn-hopebay"><span class="hopebay-icon btn-icon-group-list user-list"></a>'
  $('div.toolbar').html(a);
  $("[data-toggle=popover]").popover();
  $("[data-toggle=popover]", oListUserTable.fnGetNodes()).popover()

  // Group table with pagination
  data_opt["iDisplayLength"] = 6;
  data_opt['aoColumnDefs'] = [{ "bSearchable": true, "bSortable": false, "aTargets": [0] },
                              { "bSearchable": false, "bSortable": false, "aTargets": [1, 2] }]
  data_opt['oLanguage']['sInfo'] = __('group_information_message')
  data_opt['oLanguage']['sInfoEmpty'] = __('group_information_message')
  oAddUserTable = $("#table_add_cifs_users").dataTable(data_opt);
  oModUserTable = $("#table_mod_cifs_users").dataTable(data_opt);
  $("#table_mod_cifs_users_wrapper div.toolbar").html(b);
  oModUserTable.dataTableExt.afnFiltering.push(
    function( settings, data, dataIndex ) {
      if (all_tag)
        return true

      //console.log($(oModUserTable.fnGetNodes(dataIndex)).find('input[value=J]').prop('checked'))
      if ($(oModUserTable.fnGetNodes(dataIndex)).find('input[value=J]').prop('checked'))
        return true;

      return false
    }
  );


  // Folder table with pagination
  data_opt["iDisplayLength"] = 6;
  data_opt['aoColumnDefs'] = [{ "bSearchable": true, "bSortable": true, "aTargets": [0, 1] },]
  data_opt['oLanguage']['sInfo'] = __('folder_information_message')
  data_opt['oLanguage']['sInfoEmpty'] = __('folder_information_message')
  oListFolderTable = $("#table_folder_cifs_users").dataTable(data_opt);

  add_validator = $("#form-add-cifs-user").validate({
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
      add_validator.element(element);
      $('#add-cifs-user-submit').prop('disabled', !add_validator.checkForm());
    },
    onfocusout: function(element){
      add_validator.element(element);
      $('#add-cifs-user-submit').prop('disabled', !add_validator.checkForm());
    },
    submitHandler: function(form) {
      loadingUI();
      $('#modal-add-cifs-user').hide();
      $(oAddUserTable.fnGetNodes()).find('input:checked').appendTo($('#table_cifs_user_submit_add'))
      /*var values = [];
      fields = oAddUserTable.$("input[id$='_J']").serializeArray();
      $.each(fields, function(i, field) {
        values.push(field.value);
      });
      values.push("everyone");
      var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", "groups").val(values);
      $('#form-add-cifs-user').append($(input));*/
      form.submit();
    },
    rules: {
      username: {
        required: true,
        username_check: true,
        minlength: 1,
        maxlength: 32,
      },
      password2: {
        required: true,
        equalTo: "#modal_add_user_password",
      },
    },
    messages: {
    }
  });
  passwd_validator = $("#form-passwd-cifs-user").validate({
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
      passwd_validator.element(element)
      $('#passwd-cifs-user-submit').prop('disabled', !passwd_validator.checkForm());
    },
    onfocusout: function(element){
      passwd_validator.element(element)
      $('#passwd-cifs-user-submit').prop('disabled', !passwd_validator.checkForm());
    },
    submitHandler: function(form) {
      loadingUI();
      $('#modal-passwd-cifs-user').hide();
      form.submit();
    },
    rules: {
      password2: {
        required: true,
        equalTo: "#modal_change_user_password",
      },
    },
    messages: {
    }
  });
  edit_validator = $("#form-mod-cifs-user").validate({
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
    onkeyup: function(element){
      $('#mod-cifs-user-submit').prop('disabled', false);
    },
    onclick: function(element){
      $('#mod-cifs-user-submit').prop('disabled', false);
    },
    submitHandler: function(form) {
      loadingUI();
      $('#modal-mod-cifs-user').hide();
      $(oModUserTable.fnGetNodes()).find('input:checked').appendTo($('#table_cifs_user_submit_mod'))
      form.submit();
    },
    rules: {
    },
    messages: {
    }
  });


  // Check confirm of delete user
  $('input:checkbox[name="purge"]').change(function(){
    if ($(this).prop("checked"))
      $("#del_btn").prop("disabled", false);
    else
      $("#del_btn").prop("disabled", true);
  });

  // Toggle user status
  $('.switch-mini', oListUserTable.fnGetNodes()).on('switch-change', function (e, data) {
    loadingUI();
    var username = $(this).data('id');
    $.post(
      __("volume_cifs_user_toggle"),
      {"username": username}
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

  $(".modal").on('shown', function() {
    $(this).find("[autofocus]:first").focus();
  });

  // Button events
  $('.user-folder', oListUserTable.fnGetNodes()).click(function(){
    cifs_user_folder($(this).data('id'), $(this).data('domain'))
  });
  $('.user-modify', oListUserTable.fnGetNodes()).click(function(){
    cifs_user_modify($(this).data('id'), $(this).data('desc'));
  });
  $('.user-passwd', oListUserTable.fnGetNodes()).click(function(){
    cifs_user_password($(this).data('id'))
  });
  $('.user-delete', oListUserTable.fnGetNodes()).click(function(){
    cifs_user_delete($(this).data('id'))
  });
  $('.user-create').click(function(){
    cifs_user_create();
  });
  $('.user-list').click(function(){
    cifs_user_modify_all();
  });
});

function cifs_user_modify_all(){
  all_tag = true;
  oModUserTable.fnDraw();
}

function cifs_user_delete(user_name) {
  $('input:checkbox[name="purge"]').prop("checked", false);
  $("#del_btn").prop("disabled", true);

  $("#modal-del-cifs-user .modal-body p b").text(user_name);
  $('#modal_del_user_name').val(user_name);
  $('#modal-del-cifs-user').modal({ backdrop: 'static', keyboard: true });
}

function cifs_user_modify(user_name, description) {
  $('#modal-mod-cifs-user input[type="search"]').val('');
  $('#mod-cifs-user-submit').prop('disabled', true);

  $('#modal_mod_user_name').val(user_name);
  $('#modal_mod_description').val(description);

  $.ajax({
      url: "/volume/cifs/user/info",
      type: "POST",
      data: {"username": user_name},
      success: function(data) {
        var oSettings = oModUserTable.fnSettings();
        oSettings._iDisplayLength = oModUserTable.fnGetData().length;
        all_tag = true;
        oModUserTable.fnDraw();
        $('#table_mod_cifs_users input[value=L]').prop("checked", true);
        $.each(data["groups"], function(index, name) {
          $('#table_mod_cifs_users input[id=group_'+name+'_J'+']').prop("checked", true);
        });
        oSettings._iDisplayLength = 6;
        all_tag = false;
        oModUserTable.fnDraw();

        /*$.each(oModUserTable.fnGetNodes(), function(index, data){
          $(data).hide()
          if ($('input[value=J]:checked', data).length != 0)
            $(data).show()
        });*/
        /*$.each(oModUserTable.fnGetNodes(), function(index, data){
          console.log($('input[value=J]', data).prop('checked'));
          console.log(oModUserTable.fnGetPosition(data))
          if (!$('input[value=J]', data).prop('checked'))
            oModUserTable.fnDeleteRow(oModUserTable.fnGetPosition(data))
        });*/
      }
  });

  $('#modal-mod-cifs-user').modal({ backdrop: 'static', keyboard: true });
}

function cifs_user_folder(user_name, domain) {
  $("#modal-folder-cifs-user h3").text(__("folder_list") + user_name);

  $.ajax({
      url: "/volume/cifs/user/info",
      type: "POST",
      data: {"username": user_name, "domain": domain},
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

  $('#modal-folder-cifs-user').modal({ backdrop: 'static', keyboard: true });
}

function cifs_user_password(user_name) {
  passwd_validator.resetForm();
  $("#modal-passwd-cifs-user h3").text(__("ch_passwd") + user_name);
  $('#passwd-cifs-user-submit').prop('disabled', true);
  // Init form
  $("#modal_change_user_password").val('');
  $("#modal_change_user_password2").val('');

  $('#modal_passwd_user_name').val(user_name);
  $('#modal-passwd-cifs-user').modal({ backdrop: 'static', keyboard: true });
}

function cifs_user_create(){
    // Init
    add_validator.resetForm();
    $('#modal-add-cifs-user .control-group').removeClass('error');
    $('#modal-add-cifs-user input[value=L]').prop('checked', true);
    $('#add-cifs-user-submit').prop('disabled', true);
    $('#modal_add_user_name').val('')
    $('#modal_add_user_password').val('')
    $('#modal_add_user_password2').val('')
    $('#modal_add_description').val('')

    $('#modal-add-cifs-user').modal({ backdrop: 'static', keyboard: true });
};
