<?php
/**
 * The sidebar containing the main widget area.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
?>
<?php if (is_front_page()): ?>
    <?php if (is_active_sidebar('sidebar')) : ?>
        <aside id="secondary" class="sidebar-container" role="complementary">
            <div class="sidebar-inner">
                <div class="widget-area">
                    <?php dynamic_sidebar('sidebar'); ?>
                </div>
            </div>
        </aside><!-- #secondary -->
    <?php endif; ?>
<?php else: ?>
    <?php $right_box = get_field('right_box'); ?>
    <?php if (!empty($right_box)): ?>
        <aside id="secondary" class="sidebar-container" role="complementary">
            <div class="sidebar-inner">
                <div class="widget-area">
                    <div class="text_right_boxt">
                        <?php echo $right_box; ?>
                    </div>
                </div>
            </div>
        </aside>
    <?php endif; ?>        
<?php endif; ?>