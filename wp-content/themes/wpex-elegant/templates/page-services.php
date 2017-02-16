<?php
/**
 * Template Name: Standard page services
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header();
?>


<?php $wp_query = new WP_Query($args); ?>
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
<div id="main" class="site-main clr home-header">
    <div class="container">
        <div id="primary" class="content-area clr">
            <div id="content" class="site-content left-content clr" role="main">
                <div class="page-content">
                    <div class="">
                        <?php $content = apply_filters('the_content', $post->post_content); ?>
                        <?php $content = str_replace(']]>', ']]&gt;', $content); ?>
                        <?php echo $content; ?>
                    </div>
                    <div class="row">
                        <div class="grid-left ">
                            <?php $service_title_1 = get_field('service_title_1'); ?>
                            <?php $service_content_1 = get_field('service_content_1'); ?>
                            <?php $service_link_1 = get_field('service_link_1'); ?>

                            <?php $service_title_2 = get_field('service_title_2'); ?>
                            <?php $service_content_2 = get_field('service_content_2'); ?>
                            <?php $service_link_2 = get_field('service_link_2'); ?>

                            <?php $class_first = "symple-column symple-one-half symple-column-first   symple-all"; ?>
                            <?php $class_last = "symple-column symple-one-half symple-column-last   symple-all"; ?>
                            <article <?php post_class('service-box ' . $class_first); ?> >
                                <div class="post-wrapper">
                                    <h4 class="service-title"><?php echo $service_title_1 ?></h4>
                                    <div class="post-info-wrapper do-media">
                                        <?php echo $service_content_1; ?>
                                    </div>
                                    <?php if (!empty($service_link_1)): ?>
                                        <div class="read-more-wrapper">
                                            <a class="learn-more" href="<?php echo $service_link_1 ?>">LEARN MORE <i class="fa fa-angle-right"></i></a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </article>
                            <article <?php post_class('service-box ' . $class_last); ?> >
                                <div class="post-wrapper">
                                    <h4 class="service-title"><?php echo $service_title_2 ?></h4>
                                    <div class="post-info-wrapper do-media">
                                        <?php echo $service_content_2; ?>
                                    </div>
                                    <?php if (!empty($service_link_2)): ?>
                                        <div class="read-more-wrapper">
                                            <a class="learn-more" href="<?php echo $service_link_2 ?>">LEARN MORE <i class="fa fa-angle-right"></i></a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </article>
                        </div>
                    </div><!-- #content -->
                </div><!-- .page-content -->
            </div><!-- #main-content -->
            <aside id="secondary" class="sidebar-container" role="complementary">
                <div class="sidebar-inner">
                    <?php $tombstones_slider_servide = get_field('tombstones_slider_servide'); ?>
                    <?php if ($tombstones_slider_servide != false): ?>
                        <div class="sidebar-right ">
                            <div class="flexslider">
                                <ul class="slides">
                                    <?php if (count($tombstones_slider_servide) > 0) : ?> 
                                        <?php foreach ($tombstones_slider_servide as $key => $post_tombstone_id): ?>
                                            <?php //die(var_dump($post_tombstone->ID)); ?>
                                            <!-- CONTENT -->
                                            <?php $post_tombstone = get_post($post_tombstone_id); ?>
                                            <li <?php post_class('tombstone-box', $post_tombstone->ID); ?> id="post-<?php echo $post_tombstone->ID; ?>">
                                                <div class="post-wrapper">
                                                    <h4 class="tombstone-slider-title"><?php echo $post_tombstone->post_title ?></h4>
                                                    <?php $src = wp_get_attachment_image_src(get_post_thumbnail_id($post_tombstone->ID), 'full'); ?>
                                                    <?php $imgurl = $src[0]; ?>
                                                    <a class="" href="<?php the_permalink() ?>">
                                                        <img class="img-responsive" src="<?php echo $imgurl; ?>"  alt="<?php echo $post_tombstone->post_title ?>" />
                                                    </a>
                                                    <div class="post-info-wrapper do-media">
                                                        <?php echo $post_tombstone->post_excerpt ?>
                                                    </div>
                                                    <div class="read-more-wrapper">
                                                        <a class="learn-more" disabled href="javascript: void(0)<?php // echo get_permalink($post_tombstone->ID)       ?>">LEARN MORE <i class="fa fa-angle-right"></i></a>
                                                    </div>
                                                </div>
                                            </li>
                                            <!-- END CONTENT -->
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </aside>
        </div><!-- #primary -->
    </div>
</div>
<?php get_footer(); ?>