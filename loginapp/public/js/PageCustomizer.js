$(document).ready(function () {
	$('a').each(function () {
		$(this).on('click', function() {
			if($(this).attr('class') == 'active') $(this).removeClass('active');
			else $(this).addClass('active');
		});
	});
});