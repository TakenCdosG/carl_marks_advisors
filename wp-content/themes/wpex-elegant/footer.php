<?php/** 
* The template for displaying the footer. 
* * @package WordPress 
* @subpackage Elegant WPExplorer Theme 
* @since Elegant 1.0 
*/
?>
<!-- <div class="clear clearfix"></div> -->
<div class="blue-box">
   <div id="footer-wrap" class="site-footer clr">
      <div id="footer" class="clr container">
         <div id="footer-widgets" class="clr">
            <div class="footer-box span_1_of_6 col col-1">                    <?php dynamic_sidebar('footer-one'); ?>                </div>
            <!-- .footer-box -->                
            <div class="footer-box span_2_of_6 col col-2">                    <?php dynamic_sidebar('footer-two'); ?>                </div>
            <!-- .footer-box -->                
            <div class="footer-box span_1_of_3 col col-3">                    <?php dynamic_sidebar('footer-three'); ?>                </div>
            <!-- .footer-box -->   
            <div class="footer-box span_3_of_3 col col-3" style="margin-left: 0px;"><p style="color: #fff;display: block;position: relative;"><i>Securities offered through Carl Marks Securities LLC, a member of FINRA and <a href="http://www.sipc.org/" target="_blank">SIPC</a></i></p></div>         
         </div>
         <!-- #footer-widgets -->        
      </div>
      <!-- #footer -->    
   </div>
   <!-- #footer-wrap -->    <!--</div> #wrap -->
</div>
<div class="clear clearfix"></div>
<?php wp_footer(); ?>

<script>    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');    ga('create', 'UA-55901185-1', 'auto');    ga('send', 'pageview');</script></body></html>