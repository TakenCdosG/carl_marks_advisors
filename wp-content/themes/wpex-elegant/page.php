<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that other
 * 'pages' on your WordPress site will use a different template.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header();
?>
<div id="main" class="site-main clr home-header">
    <div class="container">
        <div id="primary" class="content-area clr">
            <?php if (!is_front_page()) { ?>
                <header class="page-header clr">
                    <h1 class="page-header-title"><?php the_title(); ?></h1>
                </header><!-- #page-header -->
            <?php } ?>
            <div id="content" class="site-content left-content" role="main">
                <?php if (has_post_thumbnail()) { ?>
                    <div class="page-thumbnail">
                        <img src="<?php echo wpex_get_featured_img_url(); ?>" alt="<?php echo esc_attr(the_title_attribute('echo=0')); ?>" />
                    </div><!-- .page-thumbnail -->
                <?php } ?>
                <div class="page-content">
                    <?php $content = apply_filters('the_content', $post->post_content); ?>
                    <?php $content = str_replace(']]>', ']]&gt;', $content); ?>
                    <?php echo $content; ?>
                </div><!-- .page-content -->
            </div><!-- #content -->
            <?php get_sidebar(); ?>
        </div><!-- #primary -->
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>