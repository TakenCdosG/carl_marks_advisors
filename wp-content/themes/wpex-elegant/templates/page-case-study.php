<?php
/**
 * Template Name: Standard page Case Study
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
<?php $accordion_section = get_accordion_section(get_accordion_elements()); ?>
<?php $text_call_to_action = get_field('text_call_to_action'); ?>
<?php $url_call_to_action = get_field('url_call_to_action'); ?>

<?php $video_title = get_field('youtube_video_title_case_study_sidebar_left_content'); ?>
<?php $youtube_video_id = get_field('youtube_video_id_case_study_sidebar_left_content'); ?>
<?php $featured_image = "http://img.youtube.com/vi/".$youtube_video_id."/0.jpg"; ?>
<?php $video_url = "http://www.youtube.com/watch?v=" . $youtube_video_id; ?>
<?php $image_sidebar_left_content = get_field('image_sidebar_left_content'); ?>
<?php $how_to_show_sidebar_left_content = get_field('how_to_show_sidebar_left_content'); ?>

<?php $youtube_video_featured_image = get_field('youtube_video_featured_image'); ?>
<?php $video_link_featured_image = get_field('video_link_featured_image'); ?>

<?php
    if(!empty($video_link_featured_image)){
       $video_url = $video_link_featured_image;
    }
    if(!empty($youtube_video_featured_image)){
       $featured_image = $youtube_video_featured_image;
    }
?>
<?php 
    $class = 'sidebar-left';
    $class_site_content = 'site-content col-md-6';
    if(empty($how_to_show_sidebar_left_content)){
        $class = 'no-sidebar-left';
        $class_site_content = 'site-content left-content clr';
    }
?>

<?php
function cmp($a, $b){
    return strcmp($a["last_name"], $b["last_name"]);
}
$case_study_team = get_field('case_study_team'); 
$team = array();
if(is_array($case_study_team)){
    foreach ($case_study_team as $key => $people) {
        $item = array();
        $item['name'] = $people->post_title;
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

if($team>0){
    usort($team, "cmp");
}

?>

<div id="top-header" class="top-header">
    <div class="content-area site-main clr container">
        <h3 class="post-title <?php if (!$has_excerpt): ?> no_has_excerpt<?php endif; ?>">Case Study: <?php the_title(); ?></h3>
        <div class="clr container">
            <div class="top-content-box">
                <p><?php echo $excerpt; ?></p>
            </div>
        </div>
    </div>
</div>
<div id="main" class="site-main clr home-header <?php echo $class;?>">
    <div class="container">
        <div id="primary" class="content-area clr">
            <div class="row">
                <?php  if(!empty($how_to_show_sidebar_left_content)): ?>
                    <aside class="col-md-3 sidebar-container tombstones" role="complementary">
                        <div class="sidebar-inner">

                            <?php if (in_array('image', $how_to_show_sidebar_left_content)): ?>
                               <article class="image-article">
                                    <img src="<?php echo $image_sidebar_left_content; ?>" class="text-center" alt="">
                                </article>
                            <?php endif; ?>

                            <?php if (in_array('video', $how_to_show_sidebar_left_content)): ?>
                                <div class="sidebar-right ">
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
                                </div>
                            <?php endif; ?>

                        </div>
                    </aside>
                <?php endif; ?>
                <div id="content" class="<?php echo $class_site_content; ?>" role="main">
                    <div class="page-content">
                        <div class="symple-accordion-container">
                            <?php echo $accordion_section; ?>
                        </div>
                        <div class="clear"></div>
                        <?php if(!empty($text_call_to_action) && !empty($url_call_to_action)):?>
                            <div class="call_to_action_btn">
                                 <a class="call-to-action-button" href="<?php echo $url_call_to_action; ?>"><?php echo $text_call_to_action;?></a>
                            </div>
                        <?php endif; ?>
                    </div><!-- .page-content -->
                </div><!-- #main-content -->

                <aside  class="col-md-3 investment-banking-team sidebar-container" role="complementary">
                    <h5 class="title"><span>Project Team</span></h5>
                    <?php foreach ($team as $key => $people): ?>
                        <div class="people-wrapper-details">
                           <a class="img-link" href="<?php echo $people['get_permalink']; ?>">
                           <img class="img-responsive" src="<?php echo $people['imgurl'];?>" alt="<?php echo $people['name'];?>">
                           </a>
                           <div class="content-right">
                              <h4 class="font-weight-bold name"><a href="<?php echo $people['get_permalink']; ?>"><?php echo ucwords(strtolower($people['name'])); ?></a></h4>
                              <div class="sort-item picture-item__title"><?php echo $people['name'];?></div>
                              <div class="label-wrapper business-info">
                                <?php echo $people['position'];?>                                                            
                              </div>
                           </div>
                        </div>   
                    <?php endforeach; ?>
                </aside>

            </div><!-- #row -->
        </div><!-- #primary -->
    </div>
</div>
<?php get_footer(); ?>

