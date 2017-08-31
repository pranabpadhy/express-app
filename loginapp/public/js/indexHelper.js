$(document).ready(function () {
	$('input').each(function () {
		$(this).attr('disabled', 'disabled');
	});
	$('input:password').hide();
	$('.ID').hide();
	$('.pwd').hide();
	$('button').hide();
	$('#cancel').hide();
	$('#infouser').hide();
	$('#infoemail').hide();
	var userData = $('#details').data('user');
	$.ajax({
		type: 'POST',
		url: 'http://localhost:7070/getUsers',
		data: null,
		success: function (res) {
			if(!res.result) $('#details').html(res);
			else {
				res.result.forEach(function (user) {
					if(userData.includes(user.email)) {
						$('#ID').val(user._id);
						$('#name').val(user.name);
						$('#username').val(user.username);
						$('#email').val(user.email);
					}
				});
				if($('#username').val() == "") {
					$('#edit').html('Create Account on Login App');
					$('form').action('/users/register');
					$('button').html('Register');
				}
				$('#edit').on('click', editDetails);
				$('#delete').on('click', deleteAccount);
			}
		}
	});
});

var editDetails = function () {
	$('span.details').html('Edit Details');
	$('button').show();
	$('#cancel').show();
	$('#infoemail').show();
	$('.pwd').show();
	$('input:password').show();
	$('input').each(function () {
		if(this.name != 'email') $(this).removeAttr('disabled');
		if(this.name == 'username' && $(this).val()) {
			$(this).attr('disabled', 'disabled');
			$('#infouser').show();
		}
	});
}

var deleteAccount = function () {
	if(!confirm('Are you sure?')) return;
	var id = $('#delete > a').data('id');
	$.ajax({
		type: 'DELETE',
		url: '/users/delete/'+id,
		success: function (res) {
			if(res.result.ok == 1) window.location.href = '/users/logout';
			else window.location.href = '/';
		}
	});
}