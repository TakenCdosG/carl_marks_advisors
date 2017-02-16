<?php
/**
 * The Header for our theme.
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
?>
<?php $images = array(); ?>
<?php $num_photo = 7; ?>
<?php for ($i = 1; $i <= $num_photo; $i++): ?>
    <?php $tmp = get_field('image_' . $i); ?>
    <?php if ($tmp != false): ?>
        <?php $images[] = $tmp; ?>
    <?php endif; ?>
<?php endfor; ?>
<?php $lenght = count($images); ?>    
<?php $key = rand(0, $lenght - 1); ?>
<?php $is_front_page = is_front_page(); ?>
<?php $image_id = $images[$key]; ?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
        <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
        <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
        <link rel="icon" href="<?php echo home_url() ?>/wp-content/uploads/2014/08/CarlMarks_favicon.png" type="image/x-png">
        <link rel="shortcut icon" href="<?php echo home_url() ?>/wp-content/uploads/2014/08/CarlMarks_favicon.png" type="image/x-png" />
        <?php if (get_theme_mod('wpex_custom_favicon')) { ?>
            <link rel="shortcut icon" href="<?php echo get_theme_mod('wpex_custom_favicon'); ?>" />
        <?php } ?>
        <!--[if lt IE 9]>
                <script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
        <![endif]-->
        <script type="text/javascript" src="//use.typekit.net/szi5wia.js"></script>
        <script type="text/javascript">try{Typekit.load();}catch(e){}</script>
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
        <!--<div id="wrap">-->
        <?php if ($lenght > 0): ?>
            <?php $uri = wp_get_attachment_image_src($image_id, 'large'); ?>
        <?php else: ?>
            <?php if (is_singular('team')): ?>
                <?php $uri = get_field('image_service'); ?>
            <?php elseif (is_search()): ?>
                <?php $people_post_id = 7; ?>
                <?php $uri = wp_get_attachment_image_src(get_post_thumbnail_id($people_post_id), 'full'); ?>
            <?php elseif (is_singular('post')): ?>
                <?php the_post(); ?>
                <?php $uri = wp_get_attachment_image_src(get_post_thumbnail_id(36), 'full'); ?>
            <?php else: ?>
                <?php the_post(); ?>
                <?php $uri = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full'); ?>
            <?php endif; ?>
        <?php endif; ?>
        <div class="clear-bg">
            <div id="header-container" class="clr fixed-header <?php if (empty($uri)): ?>header-container-without-bg<?php endif; ?>" <?php if (isset($uri) && !empty($uri) && !$is_front_page): ?>style="background-image:url('<?php echo $uri[0]; ?>');
                     -webkit-background-size: cover;
                     -moz-background-size: cover;
                     -o-background-size: cover;
                     -ms-background-size: cover;
                     background-size: cover;
                     background-position: 50% 50%;" <?php endif; ?>>
                <div class="container-header-wrap">
                    <div id="header-wrap" class="clr fixed-header">
                        <header id="header" class="site-header clr container" role="banner">


                            <div id="logo" class="clr">
                            <a href="http://carlmarksadvisors.com" title="CARL MARKS ADVISORS" rel="home"><img src="http://carlmarksadvisors.com/wp-content/uploads/2014/09/logo-big.png" alt="CARL MARKS ADVISORS"></a>
                            </div>



                            <div id="header-widgets" class="clr">
                                <div class="header-box">
                                    <?php dynamic_sidebar('header'); ?>
                                </div><!-- .header-box -->
                            </div><!-- #header-widgets -->
                            <div id="sidr-close"><a href="#sidr-close" class="toggle-sidr-close"></a></div>
                            <div id="site-navigation-wrap">
                                <a href="#sidr-main" id="navigation-toggle"><span class="fa fa-bars"></span></a>
                                <nav id="site-navigation" class="navigation main-navigation clr" role="navigation">
                                    <?php
                                    // Display main menu
                                    wp_nav_menu(array(
                                        'theme_location' => 'main_menu',
                                        'sort_column' => 'menu_order',
                                        'menu_class' => 'dropdown-menu sf-menu',
                                        'fallback_cb' => false,
                                        'walker' => new WPEX_Dropdown_Walker_Nav_Menu()
                                    ));
                                    ?>
                                </nav><!-- #site-navigation -->
                            </div><!-- #site-navigation-wrap -->
                        </header><!-- #header -->
                    </div><!-- #header-wrap -->
                </div>
            </div><!-- #header-image -->
        </div>
        <div class="clear clearfix"></div>
        <?php
        // Displays the homepage slider based on the slides custom post type
        wpex_homepage_slider();
        ?>