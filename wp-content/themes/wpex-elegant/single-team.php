<?php
/**
 * The Template for displaying all single People posts.
 */
get_header();
?>
<?php $position = get_field('position'); ?>
<?php
$field = get_field_object('business');
$custom_title_for_bigo_page = get_field('custom_title_for_bigo_page');
$business = get_field('business');
//die(var_dump($field['choices']));
$business_label = "";
$comma = (empty($position)) ? '' : ', ';
if ($business != false) {
    if (is_array($business)) {
        $array_tmp = array();
        foreach ($business as $key => $value) {
            $array_tmp[] = $field['choices'][$value];
        }
        $business_label = $comma . implode(",", $array_tmp);
    } else {
        $business_label = $comma . $field['choices'][$business];
    }
}
?>
<div id="top-header" class="top-header">
    <div class="content-area site-main clr container">
        <h3 class="post-title"><?php the_title(); ?></h3>
        <div class="clr container">
            <div class="top-content-box">
                <?php if (!empty($custom_title_for_bigo_page)): ?>
                    <?php echo $custom_title_for_bigo_page; ?>
                <?php else: ?>
                    <p><?php echo $position . $business_label; ?></p>
                <?php endif; ?>
            </div>
        </div>
		<a class="a-print-button" href="javascript:window.print()"><img src="<?php echo get_theme_root_uri(); ?>/wpex-elegant/images/print-icon.png" alt="print this page" id="print-button" /></a>

    </div>
</div>
<div id="main" class="site-main clr home-header">
    <div class="container">
        <div id="primary" class="content-area clr">
            <div id="content" class="site-content" role="main">
                <div class="page-content">
                    <div class="row">
                        <!-- CONTENT -->
                        <?php $has_sideber_content = false; ?>
                        <?php $content_sidebar_right = get_field('content_sidebar_right'); ?>
                        <?php if ($content_sidebar_right != false && !empty($content_sidebar_right)): ?>
                            <?php $has_sideber_content = true; ?>
                        <?php endif; ?>
                        <div class="col-md-2">
                            <?php $position = get_field('position'); ?>
                            <article <?php post_class('pleople-post'); ?> id="post-<?php the_ID(); ?>">
                                <div class="post-wrapper">
                                    <?php $src = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full'); ?>
                                    <?php $imgurl = $src[0]; ?>
                                    <div class="post-img-wrapper-details do-media">
                                        <?php if (!empty($imgurl) && !is_null($imgurl)): ?>
                                            <img class="img-responsive" src="<?php echo $imgurl; ?>"  alt="<?php echo $post->post_title ?>" />
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </article>
                            <?php $contact = get_field('contact'); ?>
                            <?php $education = get_field('education'); ?>
                            <?php if ($contact != false): ?>
                                <div class="sidebar-left-widget widget_text <?php if ($education != false): ?>line-bottom<?php endif; ?>">
                                    <h5 class="widget-left-title"><span>CONTACT</span></h5>		
                                    <div class="text-left-widget">
                                        <?php echo $contact; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if ($education != false): ?>
                                <?php $education_custom_title = get_field('education_custom_title'); ?>
                                <?php if (!empty($education_custom_title) && $education_custom_title != false): ?>
                                    <?php $custom_title = $education_custom_title; ?>
                                <?php else: ?>
                                    <?php $custom_title = "EDUCATION"; ?>
                                <?php endif; ?>
                                <div class="sidebar-left-widget widget_text clr  line-bottom">
                                    <h5 class="widget-left-title"><span> <?php echo $custom_title; ?></span></h5>		
                                    <div class="text-left-widget">
                                        <?php echo $education; ?>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <?php $box_custom_title_2 = get_field('box_custom_title_2'); ?>
                            <?php $box_content_2 = get_field('box_content_2'); ?>
                            <?php if ($box_custom_title_2 != false || $box_content_2 != false): ?>
                                <div class="sidebar-left-widget widget_text clr line-bottom">
                                    <h5 class="widget-left-title"><span> <?php echo $box_custom_title_2; ?></span></h5>		
                                    <div class="text-left-widget">
                                        <?php echo $box_content_2; ?>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <?php $box_custom_title_3 = get_field('box_custom_title_3'); ?>
                            <?php $box_content_3 = get_field('box_content_3'); ?>
                            <?php if ($box_custom_title_3 != false || $box_content_3 != false): ?>
                                <div class="sidebar-left-widget widget_text clr">
                                    <h5 class="widget-left-title"><span> <?php echo $box_custom_title_3; ?></span></h5>		
                                    <div class="text-left-widget">
                                        <?php echo $box_content_3; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if ($has_sideber_content): ?>
                            <div class="page-break"><br/><br/><br/><br/><br/><br/></div>
                                <div class="col-md-12 righ_sideber_content force-left visible-print">
                                    <div class="text-vertical-align-top">
                                        <?php echo $content_sidebar_right; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class=" <?php if ($has_sideber_content): ?>col-md-7<?php else: ?>col-md-10<?php endif; ?>">
                            <div class="text-vertical-align-top">
                                <?php $content = apply_filters('the_content', $post->post_content); ?>
                                <?php $content = str_replace(']]>', ']]&gt;', $content); ?>
                                <?php echo $content; ?>
                            </div>
                        </div>
                        <?php if ($has_sideber_content): ?>
                            <div class="col-md-3 right_sideber_content">
                                <div class="text-vertical-align-top">
                                    <?php echo $content_sidebar_right; ?>
                                </div>
                            </div>
                        <?php endif; ?>
                        <!-- END CONTENT -->
                    </div><!-- .row -->
                </div><!-- .page-content -->
            </div><!-- #content -->
        </div><!-- #primary -->
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>