<?php
/**


 * The default template for displaying post content.


 *


 * @package WordPress


 * @subpackage Elegant WPExplorer Theme


 * @since Elegant 1.0


 */
/**


  Entries


 * */
/**


  Posts


 * */
?>





<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>


    <?php
// Display post thumbnail


    if (has_post_thumbnail() && get_theme_mod('wpex_blog_entry_thumb', '1') == '1') {
        ?>


        <div class="loop-entry-thumbnail">


            <a href="<?php the_permalink(); ?>" title="<?php echo esc_attr(the_title_attribute('echo=0')); ?>">


                <img src="<?php echo wpex_get_featured_img_url(); ?>" alt="<?php echo esc_attr(the_title_attribute('echo=0')); ?>" />

            </a>
        </div><!-- .post-entry-thumbnail -->

    <?php } ?>
    <div class="loop-entry-text clr">
        <?php $external_link = get_field('read_more'); ?>
        <header>
            <?php
            // Display post meta details
            wpex_post_meta();
            ?>
            <?php if (!empty($external_link) && $external_link != false): ?>
                <h2 class="loop-entry-title"><a target="_blank" href="<?php echo $external_link; ?>" title="<?php echo esc_attr(the_title_attribute('echo=0')); ?>"><?php the_title(); ?></a></h2>
            <?php else: ?>
                <h2 class="loop-entry-title"><a href="<?php the_permalink(); ?>" title="<?php echo esc_attr(the_title_attribute('echo=0')); ?>"><?php the_title(); ?></a></h2>
            <?php endif; ?>
        </header>
        <div class="loop-entry-content entry clr">
            <?php //die(var_dump($external_link)); ?>
            <?php if (!empty($external_link) && $external_link != false): ?>
                <?php $wpex_readmore = "<span class='wpex-readmore'><a target='_blank'  href='" . $external_link . "'>READ MORE > </a></span>"; ?>
                <?php wpex_custom_excerpt(93, $wpex_readmore); ?>
            <?php else: ?>
                <?php
                $wpex_readmore = get_theme_mod('wpex_blog_readmore', '1') == '1' ? true : false;
                wpex_excerpt(93, $wpex_readmore);
                ?>
            <?php endif; ?>
        </div><!-- .loop-entry-content -->
    </div><!-- .loop-entry-text -->
</article><!-- .loop-entry -->


