<?php
/**
 * Template Name: Standard Video Library
 */
get_header();
?>

<?php
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
$category_slug = get_query_var('category', "featured");
/*
    $category = get_category_by_slug($category_slug ); 
    $category_id = $category->term_id;
*/
$args = array(
    'post_type' => 'video',
    'paged' => $paged,
    'posts_per_page' => -1,
    'tax_query' => array(
        array(
            'taxonomy' => 'video',
            'terms' => $category_slug,
            'field' => 'slug',
            'operator' => 'IN'
        )
    ),
);

$gallery = new WP_Query($args);
$portfolio_taxs = array();
$pcats = array();
if (is_array($gallery->posts) && !empty($gallery->posts)) {
    foreach ($gallery->posts as $gallery_post) {
        $post_taxs = wp_get_post_terms($gallery_post->ID, 'video', array("fields" => "all"));
        if (is_array($post_taxs) && !empty($post_taxs)) {
            foreach ($post_taxs as $post_tax) {
                if (is_array($pcats) && !empty($pcats) && (in_array($post_tax->term_id, $pcats) || in_array($post_tax->parent, $pcats))) {
                    $portfolio_taxs[urldecode($post_tax->slug)] = $post_tax->name;
                }
                if (empty($pcats) || !isset($pcats)) {
                    $portfolio_taxs[urldecode($post_tax->slug)] = $post_tax->name;
                }
            }
        }
    }
}

$all_terms = get_terms('video');
if (!empty($all_terms) && is_array($all_terms)) {
    foreach ($all_terms as $term) {
        if($term->slug != "featured"){
            $sorted_taxs[urldecode($term->slug)] = $term->name;
        }
        /*
            if (array_key_exists(urldecode($term->slug), $portfolio_taxs)) {
                $sorted_taxs[urldecode($term->slug)] = $term->name;
            }
        */
    }
}

$portfolio_taxs = $sorted_taxs;
$portfolio_category = get_terms('video');
//die(var_dump($portfolio_taxs));

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
                <div class="page-content portfolio portfolio-three">
                    <?php if (is_array($portfolio_taxs) && !empty($portfolio_taxs) && get_post_meta($post->ID, 'pyre_portfolio_filters', true) != 'no'): ?>
                        <div class="gallery_wrapper">
                            <div class="col-md-3">
                                <ul class="portfolio-tabs clearfix">
                                    <!--<li class="active"><a data-filter="*" href="#"><?php //echo __('All', 'Avada'); ?></a></li>!-->
                                    <?php foreach ($portfolio_taxs as $portfolio_tax_slug => $portfolio_tax_name): ?>
                                        <?php $active = ($category_slug == $portfolio_tax_slug)?'class="active"':''; ?>
                                        <li <?php echo $active; ?>><a data-filter=".<?php echo $portfolio_tax_slug; ?>" data-real-url="/video-library/?category=<?php echo $portfolio_tax_slug; ?>" href="/video-library/?category=<?php echo $portfolio_tax_slug; ?>"><?php echo $portfolio_tax_name; ?></a></li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                            <div class="col-md-9">
                                <div class="portfolio-wrapper">
                                    <?php
                                    $iterataion = 1;
                                    while ($gallery->have_posts()): $gallery->the_post();
                                        $permalink = get_permalink();
                                        $icon_permalink = $permalink;
                                        $item_classes = '';
                                        $item_cats = get_the_terms($post->ID, 'video');
                                        $item_cats_str = "";
                                        $item_cats_slug = "";
                                        foreach ($item_cats as $key => $value) {
                                            $item_cats_str[] = $value->name;
                                            $item_cats_slug[] = $value->slug;
                                        }
                                        $item_classes = implode(" ", $item_cats_slug);
                                        $item_cats_str = implode(",", $item_cats_str);
                                        $youtube_video_id = get_field('youtube_video_id', $post->ID);
                                        $url_link = get_field('url_link', $post->ID);
                                        $open_link_in_a_new_tab = get_field('open_link_in_a_new_tab', $post->ID);
                                        $post_featured_image = get_field('featured_image', $post->ID);
                                        $image_class = '';
                                        if(!$post_featured_image){
                                            $featured_image = "http://img.youtube.com/vi/$youtube_video_id/0.jpg";
                                        }else{
                                            $featured_image = $post_featured_image;
                                            $image_class = 'post_featured_image';
                                        }
                                        $title = get_the_title();
                                        //$video_url = "http://www.youtube.com/watch?v=" . $youtube_video_id.'?rel=0';
                                        $video_url = "http://www.youtu.be/" . $youtube_video_id.'?rel=0';

                                        $link_target = ' ';
                                        // $link_target = ' target="_blank"';

                                        $url = $video_url;
                                        $rel = 'rel="video"';
                                        if(!empty($url_link)){
                                            $url = $url_link;
                                            $rel = '';
                                            if($open_link_in_a_new_tab == TRUE){
                                                $link_target = ' target="_blank"';
                                            }
                                        }
                                        $additional_class = "";
                                        if($iterataion == 3){
                                            $additional_class = "last-3rd-element";
                                            $iterataion = 1;
                                        }else{
                                            $iterataion = $iterataion + 1;
                                        }

                                        ?>
                                        <div id="pitem-<?php echo $post->ID; ?>" data-item-id="<?php echo $post->ID; ?>" class="portfolio-item portfolio-item-<?php echo $post->ID; ?> <?php echo $item_classes; ?> <?php echo $additional_class; ?> col-md-4">
                                            <span class="vcard" style="display: none;"><span class="fn"><?php the_author_posts_link(); ?></span></span>
                                            <span class="updated" style="display: none;"><?php the_modified_time('c'); ?></span>
                                            <div class="image" aria-haspopup="true">
                                                <img width="300" height="214" src="<?php echo $featured_image; ?>" class="attachment-portfolio-three wp-post-image <?php echo $image_class; ?>" alt="">
                                                <div class="image-extras">
                                                    <div class="image-extras-content">
                                                        <a style="display:none;" class="icon link-icon" href="<?php echo $icon_permalink; ?>"<?php echo $link_target; ?>>Permalink</a>
                                                        <a style="display:inline-block;" class="icon gallery-icon" href="<?php echo $url; ?>" <?php echo $link_target; ?> <?php echo $rel; ?> title="<?php echo $title; ?>"><img style="display:none;" alt="<?php echo $title; ?>" />Gallery</a>
                                                        <h3 style="display:none;" class="entry-title"><a href="javascript:void(0);"<?php echo $link_target; ?>><?php the_title(); ?></a></h3>
                                                        <h4 style="display:none;"><a href="javascript:void(0);"><?php echo $item_cats_str; ?></a></h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="title-summary">
                                                <h3 class="entry-title"><?php the_title(); ?></h3>
                                                <!--<h4><?php //echo $item_cats_str; ?></h4>-->
                                            </div>
                                        </div>
                                        <?php
                                    endwhile;
                                    ?>
                                </div>
                            </div>
                        </div>

                    <?php endif; ?>
                </div><!-- .page-content -->
            </div><!-- #content -->
        </div><!-- #primary -->
    </div><!-- #main-content -->
</div>
<?php get_footer(); ?>
