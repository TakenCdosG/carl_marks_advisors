<?php

/**

 * Template Name: Standard page people(Carl Marks Management Company)

 *

 * @package WordPress

 * @subpackage Elegant WPExplorer Theme

 * @since Elegant 1.0

 */

get_header();

?>



<?php $orderby = 'title'; ?>

<?php $order = 'ASC'; ?>

<?php $temp = $wp_query; ?>

<?php $wp_query = null; ?>

<?php

$args = array(

    'post_type' => 'team',

    'posts_per_page' => -1,

    'orderby' => $orderby,

    'order' => $order,

    'meta_query' => array(

        array(

            'key' => 'business',

            'value' => 3,

            'compare' => 'LIKE'

        ),

    )

);

?>

<?php $wp_query = new WP_Query($args); ?>



<?php $wp_query_organized = people_sort($wp_query->posts); ?>

<?php //die(var_dump($wp_query_organized));   ?>

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

            <div id="content" class="site-content" role="main">

                <div class="page-content">    

                    <div class="row"> 

                        <div id="grid" class="row">

                            <?php if ($wp_query->have_posts()) : ?>

                                <?php $post_number = $wp_query->post_count; ?>

                                <?php $ite = 1; ?>

                                <?php $i = 1; ?>

                                <?php foreach ($wp_query_organized as $key => $post): ?>

                                    <?php if ($ite == 1): ?>

                                        <!--<div class="row"> -->

                                    <?php endif; ?>

                                    <?php $business = $post['business']; ?>

                                    <?php $str_business = ''; ?>

                                    <?php if (is_array($business)): ?>

                                        <?php $count = count($business); ?>

                                        <?php foreach ($business as $key => $value): ?>

                                            <?php $tmp = $key + 1; ?> 

                                            <?php if ($count == $tmp): ?>

                                                <?php $str_business .='"choice' . $value . '"'; ?>

                                            <?php else: ?>

                                                <?php $str_business .='"choice' . $value . '", '; ?>

                                            <?php endif; ?>

                                        <?php endforeach; ?>

                                    <?php else: ?>

                                        <?php $str_business .='"choice' . $business . '"'; ?>

                                    <?php endif; ?>

                                    <div class="col-sm-4 people-item" data-groups='["all", <?php echo $str_business; ?>]' data-title="<?php if (!empty($post['key_name'])): ?><?php echo $post['key_name']; ?><?php endif; ?>">

                                        <!-- CONTENT -->

                                        <?php $position = $post['position']; ?>

                                        <?php $first_name = $post['first_name']; ?>

                                        <?php $last_name = $post['last_name']; ?>

                                        <article <?php post_class('pleople-post', $post['post_id']); ?> id="post-<?php echo $post['post_id']; ?>">

                                            <div class="post-wrapper">

                                                <?php if (!empty($first_name) && !empty($last_name)): ?>

                                                    <div class="sort-item picture-item__title"><?php echo $last_name ?> <?php echo $first_name ?></div>

                                                <?php endif; ?>

                                                <?php $src = wp_get_attachment_image_src(get_post_thumbnail_id($post['post_id']), 'full'); ?>

                                                <?php $imgurl = $src[0]; ?>

                                                <div class="post-img-wrapper-details do-media">

                                                    <?php if (!empty($imgurl) && !is_null($imgurl)): ?>

                                                        <a class="img-link" href="<?php echo get_the_permalink($post['post_id']) ?>">

                                                            <img class="img-responsive" src="<?php echo $imgurl; ?>"  alt="<?php echo $post['post_title'] ?>" />

                                                        </a>

                                                    <?php endif; ?>

                                                    <div class="label-wrapper">

                                                        <h4 class="font-weight-bold"><a href="<?php echo get_the_permalink($post['post_id']) ?>"><?php if (!empty($first_name)): ?><?php echo $first_name ?><?php endif; ?> <?php if (!empty($last_name)): ?><?php echo " " . $last_name ?><?php endif; ?></a></h4>

                                                        <?php if (!empty($post['custom_title'])): ?>

                                                            <?php echo $post['custom_title']; ?>

                                                        <?php else: ?>

                                                            <h5 class="people-position"><?php echo $position; ?></h5>

                                                            <?php echo $post['business_label']; ?>

                                                        <?php endif; ?>

                                                    </div>

                                                </div>

                                            </div>

                                        </article>

                                        <!-- END CONTENT -->

                                    </div>

                                    <?php if ($ite == 3 || $i == $post_number): ?>

                                        <?php $ite = 1; ?>

                                        <!-- </div> -->

                                    <?php else: ?>

                                        <?php $ite = $ite + 1; ?>

                                    <?php endif; ?>

                                    <?php $i = $i + 1; ?>

                                <?php endforeach; ?>

                            <?php else : ?>

                                <h2 class="blog-title">Not Found</h2>

                            <?php endif; ?>

                        </div>

                    </div><!-- .row -->

                </div><!-- .page-content -->

            </div><!-- #content -->

        </div><!-- #primary -->

    </div><!-- #main-content -->

</div>

<?php get_footer(); ?>