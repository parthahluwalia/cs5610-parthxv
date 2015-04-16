<%@ Page Language="C#" %>

<script runat="server">
    <%-- This demo page has no server side script --%>
</script>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset='utf-8' />

<title>Demo Home Page</title>

  <link rel="stylesheet" type="text/css" href="css/homepage.css" />

   <!--New Home Page--> 
    <!-- Mobile Specific Metas
   ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<!-- CSS
    ================================================== -->
   <link rel="stylesheet" href="css/default.css">
	<link rel="stylesheet" href="css/layout.css">
   <link rel="stylesheet" href="css/media-queries.css">
   <link rel="stylesheet" href="css/magnific-popup.css">

   <!-- Script
   ================================================== -->
	<script src="js/modernizr.js"></script>

   <!-- Favicons
	================================================== -->
	<link rel="shortcut icon" href="favicon.png" >

</head>

<body>

<form id="form1" runat="server">

    <!--
<ul class="master_navigation">
    <li><a href="sitestatistics/" target="_blank">SiteStatistics</a></li>
    <li><a href="statistics/" target="_blank">Statistics</a></li>
    <li><a href="source/" target="_blank">Source</a></li>
    <li><a href="search/" target="_blank">Search</a></li>
    <li><a href="searchtree/" target="_blank">SearchTree</a></li>
    <li><a href="textview/" target="_blank">TextView</a></li>
    <li><a href="filelist.aspx" target="_blank">FileList</a></li>
    <li><a href="autofile.aspx" target="_blank">AutoFile</a></li>
    <li><a href="images/autoimage.aspx" target="_blank">Images</a></li>
    <li><a href="blog/" target="_blank">Blog</a></li>
</ul>

<hr /><br /><br />
    
   <div class="container">
        <div id="morph-pic">
            <img class="pic" src="images/ParthImage.jpg" />
        </div>
        
       <div id="intro">
            <h2 class="name">Parth Ahluwalia</h2>
       
            <p class="about-me"> Hi! I am a Masters in Computer Science major at Northeastern University, Boston and I am from New Delhi, India. 
                Prior to joining Northeastern University, I worked as an SAP ABAP consultant at Infosys for two years, and did my 
                undergraduation from Guru Gobind Singh Indraprastha University, India. 
                <br /> <br /> 
                This website is being developed as a part of course CS5610 : Web Development taught by Prof. Jose Annunziato. 
                I look forward to explore the freedom of learning new technologies in this course and use them to channel my 
                ideas to diverse practical implementations. 
            </p>
        </div>
    </div>
    
    <div class="footer">
        
        <ul>
            <li><a href="story/index.htm?../experiments/story.txt" class="bottom">
                EXPERIMENTS
                </a></li>
            <li><a href="#" class="bottom">
                PROJECT 
                </a></li>
            <li><a href="https://github.com/parthxv/cs5610-parthxv" class="bottom">GITHUB</a></li>
        </ul>

        

    </div>
    
    -->

    <header id="home">

      <nav id="nav-wrap">

         <a class="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
	      <a class="mobile-btn" href="#" title="Hide navigation">Hide navigation</a>

         <ul id="nav" class="nav">
            <li class="current"><a class="smoothscroll" href="#home">Home</a></li>
            <li><a class="smoothscroll" href="#about">About</a></li>
	         <li><a class="smoothscroll" href="#resume">Resume</a></li>
            <li><a class="smoothscroll" href="#portfolio">Works</a></li>
            <li><a class="smoothscroll" href="#testimonials">Testimonials</a></li>
         </ul> <!-- end #nav -->

      </nav> <!-- end #nav-wrap -->
        
      <div class="row banner">
         <div class="banner-text">
             <img class="profile-pic" src="images/ParthImage.jpg" />               
                        
             <h1 class="responsive-headline">Parth Ahluwalia.</h1>
            <h3>
                I'm a <span>Computer Science</span> major at <span>Northeastern University</span>, and I'm from <span>New Delhi, India.</span>
                Prior to joining Northeastern University, I worked as an <span>SAP ABAP Developer</span> at Infosys, and did my 
                undergraduation from Guru Gobind Singh Indraprastha University, India. 
                <br />
                The projects have been developed as a part of the course <span>CS5610</span> taught by <span>Prof. Jose Annunziato.</span> I relished learning new technologies in 
                this course that I could use to channel my ideas to diverse practical implementations.
            </h3>
            <hr />

         </div>
          
      </div>

      <p class="scrolldown">
         <a class="smoothscroll" href="#portfolio"><i class="icon-down-circle"></i></a>
      </p>

   </header> <!-- Header End -->

    <!--Portfolio Section-->
    <section id="portfolio">

      <div class="row">

         <div class="twelve columns collapsed">

            <h1>Check Out My Works</h1>

            <!-- portfolio-wrapper -->
            <div id="portfolio-wrapper" class="bgrid-quarters s-bgrid-thirds cf">

                <!--Experiments-->
          	   <div class="columns portfolio-item">
                  <div class="item-wrap">

                     <a href="story/index.htm?../experiments/story.txt">
                        <img alt="" src="images/portfolio/js_exp.png">
                        <div class="overlay">
                           <div class="portfolio-item-meta">
          					      <h5>EXPERIMENTS</h5>
                              <p>Illustrration</p>
          					   </div>
                        </div>
                        <div class="link-icon"><i class="fa fa-2x fa-flask"></i></div>
                     </a>
                      <h5 class="exp-title">EXPERIMENTS</h5>
                  </div>
          		</div> <!-- item end -->

                <!--Project-->
               <div class="columns portfolio-item">
                  <div class="item-wrap">

                     <a href="#">
                        <img alt="" src="images/portfolio/Black_desert.jpg">
                        <div class="overlay">
                           <div class="portfolio-item-meta">
          					      <h5>PROJECT</h5>
                              <p>Sentiments Social Network</p>
          					   </div>
                        </div>
                        <div class="link-icon">
                            <i class="fa fa-2x fa-flask"></i>
                        </div>
                     </a>
                      <h5 class="exp-title">PROJECT</h5>
                      <h6 class="exp-title">Sentiments Social Network</h6>
                  </div>
          		</div> <!-- item end -->

               <div class="columns portfolio-item">
                  <div class="item-wrap">

                     <a href="#" title="">
                        <img alt="" src="images/portfolio/origami.jpg">
                        <div class="overlay">
                           <div class="portfolio-item-meta">
          				        <h5>DOCUMENTATION</h5>
                                <p>Project Documentation</p>
          				    </div>
                        </div>
                        <div class="link-icon"><i class="fa fa-2x fa-book"></i></div>
                     </a>
                    <h5 class="exp-title">DOCUMENTATION</h5>
                  </div>
          		</div> <!-- item end -->

               <div class="columns portfolio-item">
                  <div class="item-wrap">

                     <a href="#" title="">
                        <img alt="" src="images/portfolio/github.jpg">
                        <div class="overlay">
                           <div class="portfolio-item-meta">
          					      <h5>GITHUB</h5>
                              <p>GitHub</p>
          					   </div>
                        </div>
                        <div class="link-icon"><i class="fa fa-2x fa-github"></i></div>
                     </a>
                    <h5 class="exp-title">GitHub</h5>
                  </div>
          		</div> <!-- item end -->

            </div>
         </div>
      </div> <!-- row End -->

   </section> <!-- Portfolio Section End-->

    <!-- footer
   ================================================== -->
   <footer>

      <div class="row">

         <div class="twelve columns">

            <ul class="social-links">
               <li><a href="#"><i class="fa fa-facebook"></i></a></li>
               <li><a href="#"><i class="fa fa-twitter"></i></a></li>
               <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
               <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
               <li><a href="#"><i class="fa fa-instagram"></i></a></li>
               <li><a href="#"><i class="fa fa-dribbble"></i></a></li>
               <li><a href="#"><i class="fa fa-skype"></i></a></li>
            </ul>

            <span class="white-text">
                &copy; Parth Ahluwalia | CS5610 Spring 2015 | Northeastern University
            </span>

         </div>

      </div>

   </footer> <!-- Footer End-->

</form>


    <!-- Java Script
   ================================================== -->
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
   <script>window.jQuery || document.write('<script src="js/jquery-1.10.2.min.js"><\/script>')</script>
   <script type="text/javascript" src="js/jquery-migrate-1.2.1.min.js"></script>

   <script src="js/jquery.flexslider.js"></script>
   <script src="js/waypoints.js"></script>
   <script src="js/jquery.fittext.js"></script>
   <script src="js/magnific-popup.js"></script>
   <script src="js/init.js"></script>

</body>
</html>
