<?php
/**
 * Template Name: Timeline
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
                    <div class="top-content">
                        <?php $content = apply_filters('the_content', $post->post_content); ?>
                        <?php $content = str_replace(']]>', ']]&gt;', $content); ?>
                        <?php echo $content; ?>
                    </div>
                    <?php $orderby = 'meta_value_num'; ?>
                    <?php $order = 'ASC'; ?>
                    <?php $temp = $wp_query; ?>
                    <?php $wp_query = null; ?>
                    <?php $args = array('post_type' => 'history', 'posts_per_page' => -1, 'orderby' => $orderby, 'order' => $order, 'meta_key' => 'year'); ?>
                    <?php $wp_query = new WP_Query($args); ?>
                    <?php $post_number = $wp_query->post_count; ?>
                    <?php $it = 1; ?>
                    <?php $last_class = false; ?>
                    <?php while ($wp_query->have_posts()): ?>
                        <?php $wp_query->the_post(); ?>
                        <?php if ($post_number == $it): ?>
                            <?php $last_class = true; ?>
                        <?php endif; ?>
                        <!--Year-->
                        <div class = "year-article  <?php if ($last_class): ?>last-year<?php endif; ?>">
                            <div class = "year">
                                <?php $year = get_field('year');
                                ?>
                                <p><?php echo $year; ?></p>
                            </div>
                            <div class="content-year-area">
                                <?php the_content(); ?> 
                                <?php if (!$last_class): ?>
                                    <div class="circle"></div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <!-- End Year -->
                        <?php $it = $it + 1; ?>
                    <?php endwhile; ?>
                </div><!-- .page-content -->
            </div><!-- #content -->
            <?php get_sidebar(); ?>
        </div><!-- #primary -->
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>