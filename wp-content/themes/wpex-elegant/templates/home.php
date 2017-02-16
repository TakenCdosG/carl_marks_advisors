<?php
/**
 * Template Name: Homepage
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header();
?>
<?php $first_bucket_title = get_field('first_bucket_title'); ?>
<?php $first_bucket_content = get_field('first_bucket_content'); ?>

<?php $second_bucket_title = get_field('second_bucket_title'); ?>
<?php $second_bucket_content = get_field('second_bucket_content'); ?>

<?php $third_bucket_title = get_field('third_bucket_title'); ?>
<?php $third_bucket_content = get_field('third_bucket_content'); ?>

<div id="main" class="site-main clr home-header">
    <div class="container">
        <div id="primary" class="content-area clr">
            <div id="content" class="site-content clr" role="main">
                <div class="page-content">
                    <?php the_content(); ?>  
                </div><!-- .page-content -->
                <div class="page-buckets">
                    <div class="bucket symple-column symple-one-third symple-column-first symple-all">
                        <h2 class="white-subhead"><?php echo $first_bucket_title; ?></h2>
                        <div class="bucket-content">
                            <?php echo $first_bucket_content; ?>
                        </div>
                    </div>  
                    <div class="bucket symple-column symple-one-third symple-column-middle symple-all">
                        <h2 class="white-subhead"><?php echo $second_bucket_title; ?></h2>
                        <div class="bucket-content">
                            <?php echo $second_bucket_content; ?>
                        </div>
                    </div>
                    <div class="bucket symple-column symple-one-third symple-column-last symple-all">
                        <h2 class="white-subhead"><?php echo $third_bucket_title; ?></h2>
                        <div class="bucket-content">
                            <?php echo $third_bucket_content; ?>
                        </div>
                    </div>
                </div><!-- .page-content -->
            </div><!-- #content -->
        </div><!-- #primary -->
    </div>
</div><!-- #main-content -->
<?php get_footer(); ?>