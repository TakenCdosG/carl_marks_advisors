<?php
/**
 * Outputs the homepage slider
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
if (!function_exists('wpex_homepage_slider')) {

    function wpex_homepage_slider() {
        global $post;
        if (!is_front_page())
            return;
        // Get slides slider_order
        $wpex_query = new WP_Query(
                        array(
                            'post_type' => 'slides',
                            'posts_per_page' => '-1',
                            'no_found_rows' => true,
                            'meta_key' => 'slider_order',
                            'orderby' => 'meta_value_num',
                            'order' => 'ASC'
                        )
        );
        // Display Slides
        if ($wpex_query->posts) {
            ?>
            <div id="homepage-slider-wrap" class="clr flexslider-container">
                <div id="homepage-slider" class="flexslider">
                    <ul class="slides clr">
                        <?php
                        // Loop through each slide
                        foreach ($wpex_query->posts as $post) : setup_postdata($post);
                            $post_id = $post->ID;
                            $title = esc_attr(the_title_attribute('echo=0'));
                            $custom_caption = get_field('caption');
                            if (!empty($custom_caption) && $custom_caption != false) {
                                $caption = $custom_caption;
                            } else {
                                $caption = get_post_meta($post_id, 'wpex_slide_caption', true);
                            }

                            $url = get_post_meta($post_id, 'wpex_slide_url', true);
                            $url_target = get_post_meta($post_id, 'wpex_slide_target', true);
                            $url_target = $url_target ? $url_target : 'blank';
                            ?>
                            <li class="homepage-slider-slide">
                                <?php if ('' !== $url) { ?>
                                    <a href="<?php echo $url; ?>" title="<?php echo $title; ?>" target="_<?php echo $url_target; ?>">
                                    <?php } ?>
                                    <div class="homepage-slide-inner container visible-big">
                                        <div class="homepage-slide-content">
                                         <!-- <div class="homepage-slide-title"><?php the_title(); ?></div> -->
                                            <?php if ('' != $caption) { ?>
                                                <div class="clr"></div>
                                                <div class="homepage-slide-caption"><?php echo $caption; ?></div>
                                            <?php } ?>
                                        </div><!-- .homepage-slider-content -->
                                    </div>
                                    <div class="homepage-slide-inner container visible-xs" style="margin: 0;padding: 0;width: 100%; overflow: hidden;background-size: cover;background-position: center;background-image: url(<?php echo wpex_get_featured_img_url(); ?>);height: 525px;display: block;position: relative;max-width:100%;">
                                        <div class="homepage-slide-content">
                                         <!-- <div class="homepage-slide-title"><?php the_title(); ?></div> -->
                                            <?php if ('' != $caption) { ?>
                                                <div class="clr"></div>
                                                <div class="homepage-slide-caption"><?php echo $caption; ?></div>
                                            <?php } ?>
                                        </div><!-- .homepage-slider-content -->
                                    </div>
                                    <img src="<?php echo wpex_get_featured_img_url(); ?>" alt="<?php echo $title; ?>">
                                    <?php if ('' !== $url) { ?>
                                    </a>
                                <?php } ?>
                            </li>
                        <?php endforeach; ?>
                    </ul><!-- .slides -->
                </div><!-- .flexslider -->
            </div><!-- #homepage-slider" -->
            <script>
                jQuery(document).ready(function() {
                    var width = jQuery(this).width();    // Current image width
                    var height = jQuery(this).height();  // Current image height
                    if(width<=768){
                        console.log("//-> Apply.");
                        //jQuery('.home .flexslider .slides img').resizeToParent();
                    }                    
                });
            </script>
            <?php
        }
        // Reset post data
        wp_reset_postdata();
    }

}