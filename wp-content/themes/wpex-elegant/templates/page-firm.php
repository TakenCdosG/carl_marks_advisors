<?php

/**

 * Template Name: Standard page firm

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

        <a class="a-print-button" href="javascript:window.print()"><img src="<?php echo get_theme_root_uri(); ?>/wpex-elegant/images/print-icon.png" alt="print this page" id="print-button" /></a>

    </div>

</div>



<?php $fullwidth = false; ?>

<?php $right_box = get_field('right_box'); ?>

<?php if (empty($right_box) || $right_box == false): ?>

    <?php $fullwidth = true; ?>

<?php endif; ?>   

<div id="main" class="site-main clr home-header">

    <div class="container">

        <div id="primary" class="content-area clr">

            <div id="content" class="site-content <?php if ($fullwidth == false): ?>left-content<?php endif; ?> clr" role="main">

                <div class="page-content">

                    <?php $content = apply_filters('the_content', $post->post_content); ?>

                    <?php $content = str_replace(']]>', ']]&gt;', $content); ?>

                    <?php echo $content; ?>

                </div><!-- .page-content -->

            </div><!-- #content -->

            <?php if ($fullwidth == false): ?>

                <?php get_sidebar(); ?>

            <?php endif; ?>

        </div><!-- #primary -->

    </div>

</div><!-- #main-content -->

<?php get_footer(); ?>