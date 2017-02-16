<?php
/**
 * Template Name: Standard Page Contact
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
                    <div class="row">
                        <!-- Begin Field_firt_column_imagen -->
                        <?php $title_first_column = get_field('title_first_column'); ?>
                        <?php $content_first_column = get_field('content_first_column'); ?>
                        <div class="col-xs-4 col-md-4 without-margin-right bucket_item without-margin-left-md">
                            <div class="container-column-title"><h3 class="column_title"><?php echo $title_first_column; ?></h3></div>
                            <div class="container-content-column"><?php echo $content_first_column; ?></div>
                        </div>
                        <!-- End Field_firt_column_imagen -->
                        <!-- Begin Field_firt_column_imagen -->
                        <?php $title_second_column = get_field('title_second_column'); ?>
                        <?php $content_second_column = get_field('content_second_column'); ?>
                        <div class="col-xs-4 col-md-4 without-margin-left without-margin-right bucket_item">
                            <div class="container-column-title"><h3 class="column_title"><?php echo $title_second_column; ?></h3></div>
                            <div class="container-content-column"><?php echo $content_second_column; ?></div>
                        </div>
                        <!-- End Field_firt_column_imagen -->
                        <!-- Begin Field_firt_column_imagen -->
                        <?php $title_third_column = get_field('title_third_column'); ?>
                        <?php $content_third_column = get_field('content_third_column'); ?>
                        <div class="col-xs-4 col-md-4 without-margin-left without-margin-right bucket_item">
                            <div class="container-column-title"><h3 class="column_title"><?php echo $title_third_column; ?></h3></div>
                            <div class="container-content-column"><?php echo $content_third_column; ?></div>
                        </div>
                        <!-- End Field_firt_column_imagen -->
                    </div>
                </div><!-- .page-content -->
            </div><!-- #content -->
        </div><!-- #primary -->
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>