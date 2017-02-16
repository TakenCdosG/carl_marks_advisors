<?php
/**
 * The template for displaying the footer.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
?>
<!-- <div class="clear clearfix"></div> -->
<div class="blue-box">
    <div id="footer-wrap" class="site-footer clr">
        <div id="footer" class="clr container">
            <div id="footer-widgets" class="clr">
                <div class="footer-box span_1_of_6 col col-1">
                    <?php dynamic_sidebar('footer-one'); ?>
                </div><!-- .footer-box -->
                <div class="footer-box span_3_of_6 col col-2">
                    <?php dynamic_sidebar('footer-two'); ?>
                </div><!-- .footer-box -->
                <div class="footer-box span_1_of_3 col col-3">
                    <?php dynamic_sidebar('footer-three'); ?>
                </div><!-- .footer-box -->
            </div><!-- #footer-widgets -->
        </div><!-- #footer -->
    </div><!-- #footer-wrap -->
    <!--</div> #wrap -->
</div>
<div class="clear clearfix"></div>
<?php wp_footer(); ?>
</body>
</html>