<?php
/**
 * Template Name: Fullwidth
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header();
?>
<?php $excerpt = get_field('excerpt'); ?>
<?php $has_excerpt = !empty($excerpt); ?>
<div id="top-header" class="top-header">
    <div class="content-area site-main clr container">
        <h3 class="post-title <?php if (!$has_excerpt): ?> no_has_excerpt<?php endif; ?>"><?php the_title(); ?></h3>
        <div class="clr container">
            <div class="top-content-box">
                <p><?php echo $excerpt; ?></p>
            </div>
        </div>
    </div>
</div>
<div id="main" class="site-main clr home-header">
    <div class="container">
        <div id="primary" class="content-area clr">
            <div id="content" class="site-content" role="main">
                <div class="page-content">
<?php do_action('sjb_job_application_before'); ?>
<section class="sjb-job-application" id="apply">
    <?php do_action('sjb_job_application_start'); ?>
    <form class="jobpost_form" name="c-assignments-form" id="sjb-application-form" enctype="multipart/form-data">
        <div class="sjb-row">
            <div class="sjb-col-md-10 sjb_col-xs-12">
                <div class="sjb-row">
                    <?php
                    $keys = get_post_custom_keys(get_the_ID());
                    do_action('sjb_applicants_details_before');
                    ?>
                     <div class="wrap"><div id="icon-tools" class="icon32"></div>
                            <h3>
                                <?php
                                if (in_array('jobapp_name', $keys)):
                                    echo get_post_meta($post->ID, 'jobapp_name', true);
                                endif;
                                
                                if (in_array('resume', $keys)):
                                    ?>
                                    &nbsp; &nbsp; <small><a href="<?php echo get_post_meta($post->ID, 'resume', true); ?>" target="_blank" ><?php echo __('Resume', 'simple-job-board'); ?></a></small>
                                <?php endif; ?>

                            </h3>                
                            <table class="widefat striped">
                                <?php
                                do_action('sjb_applicants_details_start');
                                
                                foreach ($keys as $key):
                                    if (substr($key, 0, 7) == 'jobapp_') {
                                        echo '<tr><td style="font-weight: bold;">' . ucwords( str_replace('_', ' ', substr($key, 7))) . '</td><td>' . get_post_meta($post->ID, $key, true) . '</td></tr>';
                                    }
                                endforeach;
                                
                                do_action('sjb_applicants_details_end'); ?>
                            </table>
                    </div>
                </div>
            </div>    
        </div>
    </form>
    <?php do_action('sjb_job_application_end'); ?>
</section>
<div id="jobpost_form_status"></div>
<?php do_action('sjb_job_application_after'); ?>
                </div><!-- .page-content -->
            </div><!-- #content -->
        </div><!-- #primary -->
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>