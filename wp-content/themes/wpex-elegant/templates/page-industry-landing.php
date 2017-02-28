<?php
/**
 * Template Name: Standard page Industry landing
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
<?php $text_call_to_action = get_field('text_call_to_action'); ?>
<?php $url_call_to_action = get_field('url_call_to_action'); ?>
<?php $industry_landing_subtitle = get_field('industry_landing_subtitle'); ?>

<?php $industry_landing_video_featured_image = get_field('industry_landing_video_featured_image'); ?>
<?php $industry_landing_video_link = get_field('industry_landing_video_link'); ?>

<?php 
	$youtube_video_id = get_field('industry_landing_video_youtube_video_id'); 
	$video_title = get_field('industry_landing_video_title'); 
	$video_url = "";
    $featured_image = "";
    if(!empty($youtube_video_id)){
        $video_url = "http://www.youtube.com/watch?v=" . $youtube_video_id;
        $featured_image = "http://img.youtube.com/vi/".$youtube_video_id."/0.jpg";
    }
	
?>

<?php
    if(!empty($industry_landing_video_link)){
       $video_url = $industry_landing_video_link;
    }
    if(!empty($industry_landing_video_featured_image)){
       $featured_image = $industry_landing_video_featured_image;
    }
?>

<?php $industry_landing_right_content_title = get_field('industry_landing_right_content_title'); ?>
<?php $industry_landing_right_content_content = get_field('industry_landing_right_content_content'); ?>
<?php $industries_box_title_industry_landing_sidebar_left_content = get_field('industries_box_title_industry_landing_sidebar_left_content'); ?>
<?php $industries_box_content_industry_landing_sidebar_left_content = get_field('industries_box_content_industry_landing_sidebar_left_content'); ?>
<?php

function cmp($a, $b){
    return strcmp($a["last_name"], $b["last_name"]);
}

$industry_landing_page_team = get_field('industry_landing_page_team'); 
$team = array();
if(is_array($industry_landing_page_team)){
    foreach ($industry_landing_page_team as $key => $people) {
        $post_status = 'publish';
        if(isset($people->post_status) && ($people->post_status == $post_status)){
            $item = array();
            $item['name'] = $people->post_title;
            $items_name = explode(" ", $item['name']);
            $item['first_name'] = get_field('first_name', $people->ID);
            $item['last_name'] = get_field('last_name', $people->ID);
            $item['position'] = get_field('position', $people->ID);
            $item['contact'] = get_field('contact', $people->ID);
            $item['education'] = get_field('education', $people->ID);
            $src = wp_get_attachment_image_src(get_post_thumbnail_id($people->ID), 'full');
            $item['imgurl'] = $src[0];
            $item['get_permalink'] = get_permalink($people->ID);
            $team[] = $item;
        }
    }
}
if($team>0){
    usort($team, "cmp");
}

?>

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
            <div class="row">
                <?php if(!empty($youtube_video_id) || !empty($video_url) || !empty($industries_box_title_industry_landing_sidebar_left_content) || !empty($industry_landing_right_content_content)): ?>
                    <aside class="col-md-3 sidebar-container sidebar-container-left tombstones" role="complementary">
                        <div class="sidebar-inner">
                            
                            <?php if(!empty($youtube_video_id) || !empty($video_url)): ?>
                                <article class="video-article">
                                    <div class="post-wrapper">
                                        <h4 class="service-title"><?php echo $video_title;?></h4>
                                        <div class="post-info-wrapper do-media">
                                            <a href="<?php echo $video_url; ?>" rel="prettyPhoto" class="video-link" title="<?php echo $video_title;?>">
                                               <span class="video-play"></span>
                                               <img width="300" height="214" src="<?php echo $featured_image; ?>" class="" alt="">
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            <?php endif; ?>
                            
                            <?php if(!empty($industries_box_title_industry_landing_sidebar_left_content)): ?>
                                <article class="left_content">
                                    <div class="post-wrapper">
                                        <h4 class="industry-landing-blue-title"><?php echo strtoupper($industries_box_title_industry_landing_sidebar_left_content); ?></h4>
                                        <div class="post-info-wrapper do-media">
                                            <?php echo $industries_box_content_industry_landing_sidebar_left_content; ?>
                                        </div>
                                    </div>
                                </article>
                            <?php endif; ?>
                            
                            <?php if(!empty($industry_landing_right_content_content)): ?>
                                <article class="right_content">
                                    <div class="post-wrapper">
                                        <h4 class="industry-landing-blue-title"><?php echo strtoupper($industry_landing_right_content_title); ?></h4>
                                        <div class="post-info-wrapper do-media">
                                            <?php echo $industry_landing_right_content_content; ?>
                                        </div>
                                    </div>
                                </article>
                            <?php endif; ?>
                            
                        </div>
                    </aside>
                    <?php $col = "col-md-6"; ?>
                <?php else: ?>
                    <?php $col = "col-md-9"; ?>
                <?php endif; ?>
                <div id="content" class="site-content <?php echo $col; ?>" role="main">
                    <div class="page-content">
                        <?php if(!empty($industry_landing_subtitle)): ?>
                    	   <h1 class="subtitle"><?php echo $industry_landing_subtitle; ?></h1>
                        <?php endif; ?>
                        <div class="">
                            <?php $content = apply_filters('the_content', $post->post_content); ?>
                            <?php $content = str_replace(']]>', ']]&gt;', $content); ?>
                            <?php echo $content; ?>
                        </div>
                        <div class="clear"></div>
                        <?php if(!empty($text_call_to_action) && !empty($url_call_to_action)):?>
                            <div class="call_to_action_btn">
                                 <a class="call-to-action-button" href="<?php echo $url_call_to_action; ?>"><?php echo $text_call_to_action;?></a>
                            </div>
                        <?php endif; ?>
                    </div><!-- .page-content -->
                </div><!-- #main-content -->
                <aside id="secondary" class="sidebar-container col-md-3  sidebar-container-right" role="complementary">
                    <div class="sidebar-inner">
                        <article >
                            <div class="post-wrapper">
                                <h4 class="service-title">Experienced Professionals</h4>
                                <?php foreach ($team as $key => $people): ?>
                                    <div class="people-wrapper-details">
                                       <a class="img-link" href="<?php echo $people['get_permalink']; ?>">
                                       <img class="img-responsive" src="<?php echo $people['imgurl'];?>" alt="<?php echo $people['name'];?>">
                                       </a>
                                       <div class="content-right">
                                          <?php
                                               $custom_name = strtolower($people['name']);
                                               if($custom_name == "joseph r. d'angelo"){
                                                  $custom_name = "Joseph R. D'Angelo";
                                               }else{
                                                  $custom_name = ucwords($custom_name);
                                               }
                                          ?>
                                          <h4 class="font-weight-bold name"><a href="<?php echo $people['get_permalink']; ?>"><?php echo $custom_name; ?></a></h4>
                                          <div class="sort-item picture-item__title"><?php echo $people['name'];?></div>
                                          <div class="label-wrapper business-info">
                                            <?php echo $people['position'];?>                                                                                                                                       
                                          </div>
                                       </div>
                                    </div>   
                                <?php endforeach; ?>
                            </div>
                        </article>
                    </div>
                </aside>
            </div>
        </div><!-- #primary -->
    </div>
</div>
<?php get_footer(); ?>