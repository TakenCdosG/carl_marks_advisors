
<?php
/**
 * The default template for displaying search results
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
?>
<?php $post_id = get_the_ID(); ?>
<?php $post_type = get_post_type($post_id); ?>
<?php $post = get_post($post); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php $post_type = get_post_type($post_id); ?>
    <?php if ($post_type == 'people'): ?>
        <?php
        // Display post thumbnail
        if (has_post_thumbnail() && get_theme_mod('wpex_blog_entry_thumb', '1') == '1') {
            ?>
            <div class="search-entry-thumbnail">
                <a href="<?php the_permalink(); ?>" title="<?php echo esc_attr(the_title_attribute('echo=0')); ?>">
                    <img src="<?php echo wpex_get_featured_img_url(); ?>" alt="<?php echo esc_attr(the_title_attribute('echo=0')); ?>" />
                </a>
            </div><!-- .post-entry-thumbnail -->
        <?php } ?>
    <?php endif; ?>
    <div class="search-entry-text clr">
        <header>
            <h2 class="search-entry-title"><a href="<?php the_permalink(); ?>" title="<?php echo esc_attr(the_title_attribute('echo=0')); ?>"><?php echo ucwords(strtolower(the_title_attribute('echo=0'))); ?></a></h2>
        </header>
        <div class="search-entry-content entry clr">
            <?php wpex_excerpt(50); ?>
        </div><!-- .search-entry-content -->
    </div><!-- .search-entry-text -->
</article><!-- .search-entry -->