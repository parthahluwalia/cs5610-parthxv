<%@ Page Language="C#" %>

<script runat="server">
    <%-- This demo page has no server side script --%>
</script>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset='utf-8' />

<title>Demo Home Page</title>

  <link rel="stylesheet" type="text/css" href="css/homepage.css" 

</head>

<body>

<form id="form1" runat="server">


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
            <li><a href="story/index.htm?../experiments/story.txt" class="bottom">EXPERIMENTS</a></li>
            <li><a href="#" class="bottom"> PROJECT </a></li>
            <li><a href="https://github.com/parthxv/cs5610-parthxv" class="bottom">GITHUB</a></li>
        </ul>
    </div>
    

</form>

</body>
</html>
