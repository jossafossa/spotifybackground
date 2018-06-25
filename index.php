<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="x-ua-compatible" content="IE=edge">
	<meta charset="UTF-8">
	<title>spotify background</title>
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
	<link href="styles/main.css" rel="stylesheet" type="text/css"></link>
</head>
<body>

<svg id="svg-image-blur" class="background">
    <image x="0" y="0" width="100%" height="100%" id="svg-image" filter="url(#blur-effect-1)" href="" preserveAspectRatio="xMaxYMid slice"/>

    <filter id="blur-effect-1">
        <feGaussianBlur stdDeviation="20" />
    </filter>
</svg> 
  
	<div class="container">	
		<div class="image" style="width:640px; height:640px"></div>
		<h1 class="title"></h1>		
		<h2 class="artist"></h2>
	</div>
	<div class="controls">
		<div class="prev"><i class="fa fa-angle-left"></i></div>
		<div class="pause"><i class="fa fa-play"></i></div>
		<div class="next"><i class="fa fa-angle-right"></i></div>
	</div>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src="scripts/main.js">

		

	</script>


	
</body>
</html>