$(document).ready(function () {
	$('input').each(function () {
		$(this).attr('readonly', 'true');
		$(this).addClass('disabled');
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
				console.log(res.result);
				res.result.forEach(function (user) {
					if(userData.includes(user.email)) {
						$('#ID').val(user._id);
						$('#name').val(user.name);
						$('#username').val(user.username);
						$('#email').val(user.email);
					}
				});
				if($('#username').val() == "") {
					$('#username').hide();
					$('.username').hide();
					$('#edit >a').html('Create Account on Login App');
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
	$('#username').show();
	$('.username').show();
	$('.pwd').show();
	$('input:password').show();
	if($('#username').val() == "") $('button').html('Register');
	$('input').each(function () {
		if(this.name != 'email') {
			$(this).removeAttr('readonly');
			$(this).removeClass('disabled');
		}
		if(this.name == 'username' && $(this).val()) {
			$(this).attr('readonly', 'true');
			$(this).addClass('disabled');
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
			if(res.result.ok == 1) window.location.href = '/logout';
			else window.location.href = '/';
		}
	});
}