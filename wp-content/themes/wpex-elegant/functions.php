<?php


function drupal_var_export($var, $prefix = '') {
  if (is_array($var)) {
    if (empty($var)) {
      $output = 'array()';
    }
    else {
      $output = "array(\n";
      // Don't export keys if the array is non associative.
      $export_keys = array_values($var) != $var;
      foreach ($var as $key => $value) {
        $output .= '  ' . ($export_keys ? drupal_var_export($key) . ' => ' : '') . drupal_var_export($value, '  ', FALSE) . ",\n";
      }
      $output .= ')';
    }
  }
  elseif (is_bool($var)) {
    $output = $var ? 'TRUE' : 'FALSE';
  }
  elseif (is_string($var)) {
    $line_safe_var = str_replace("\n", '\n', $var);
    if (strpos($var, "\n") !== FALSE || strpos($var, "'") !== FALSE) {
      // If the string contains a line break or a single quote, use the
      // double quote export mode. Encode backslash and double quotes and
      // transform some common control characters.
      $var = str_replace(array('\\', '"', "\n", "\r", "\t"), array('\\\\', '\"', '\n', '\r', '\t'), $var);
      $output = '"' . $var . '"';
    }
    else {
      $output = "'" . $var . "'";
    }
  }
  elseif (is_object($var) && get_class($var) === 'stdClass') {
    // var_export() will export stdClass objects using an undefined
    // magic method __set_state() leaving the export broken. This
    // workaround avoids this by casting the object as an array for
    // export and casting it back to an object when evaluated.
    $output = '(object) ' . drupal_var_export((array) $var, $prefix);
  }
  else {
    $output = var_export($var, TRUE);
  }

  if ($prefix) {
    $output = str_replace("\n", "\n$prefix", $output);
  }

  return $output;
}


/**
 * Theme functions and definitions.
 *
 * Sets up the theme and provides some helper functions
 *
 * When using a child theme (see http://codex.wordpress.org/Theme_Development
 * and http://codex.wordpress.org/Child_Themes), you can override certain
 * functions (those wrapped in a function_exists() call) by defining them first
 * in your child theme's functions.php file. The child theme's functions.php
 * file is included before the parent theme's file, so the child theme
 * functions would be used.
 *
 *
 * For more information on hooks, actions, and filters,
 * see http://codex.wordpress.org/Plugin_API
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
/**
  Constants
 * */
define('WPEX_JS_DIR_URI', get_template_directory_uri() . '/js');

function add_query_vars_filter($vars) {
    $vars[] = "c";
    $vars[] = "industry";
    $vars[] = "professional";
    $vars[] = "type";
    $vars[] = "category";
    return $vars;
}

add_filter('query_vars', 'add_query_vars_filter');

/**
  Theme Setup
 * */
if (!isset($content_width))
    $content_width = 1000;

// Theme setup - menus, theme support, etc
require_once( get_template_directory() . '/functions/theme-setup.php' );

// Recommend plugins for use with this theme
require_once ( get_template_directory() . '/functions/recommend-plugins.php' );

// Adds a feed metaboxes
require_once ( get_template_directory() . '/functions/dashboard-feed.php' );

// Splash Page
require_once ( get_template_directory() . '/functions/welcome.php' );


/**
  Theme Customizer
 * */
// General Options
require_once ( get_template_directory() . '/functions/theme-customizer/header.php' );

// Portfolio Options
require_once ( get_template_directory() . '/functions/theme-customizer/portfolio.php' );

// Blog Options
require_once ( get_template_directory() . '/functions/theme-customizer/blog.php' );

// Copyright Options
require_once ( get_template_directory() . '/functions/theme-customizer/copyright.php' );


/**
  Includes
 * */
// Define widget areas
require_once( get_template_directory() . '/functions/widget-areas.php' );

// Register the features post type
if (get_theme_mod('wpex_features', '1') == '1') {
    require_once( get_template_directory() . '/functions/post-types/features.php' );
}

// Register the slides post type
if (get_theme_mod('wpex_slides', '1') == '1') {
    require_once( get_template_directory() . '/functions/post-types/slides.php' );
}

// Register the portfolio post type
if (get_theme_mod('wpex_portfolio', '1') == '1') {
    require_once( get_template_directory() . '/functions/post-types/portfolio.php' );
}

// Register the staff post type
if (get_theme_mod('wpex_staff', '1') == '1') {
    require_once( get_template_directory() . '/functions/post-types/staff.php' );
}

function filter_search($query) {
    if ($query->is_search) {

         if(isset($query->query["s"])){

           $words = $query->query["s"];
           $count = str_word_count($words);

           if($count == 1){
              //$query->set( 'exact', true );
           }

        }

    };
    return $query;
}

add_filter('pre_get_posts', 'filter_search');

add_filter('posts_orderby', 'my_sort_custom', 10, 2);

function my_sort_custom($orderby, $query) {
    global $wpdb;

    if (!is_admin() && is_search())
        $orderby = $wpdb->prefix . "posts.post_type ASC, {$wpdb->prefix}posts.post_date DESC";

    return $orderby;
}

//-> Editor
// Add Formats Dropdown Menu To MCE
if (!function_exists('wpex_style_select')) {

    function wpex_style_select($buttons) {
        array_push($buttons, 'styleselect');
        return $buttons;
    }

}
add_filter('mce_buttons', 'wpex_style_select');
// Add new styles to the TinyMCE "formats" menu dropdown
if (!function_exists('wpex_styles_dropdown')) {

    function wpex_styles_dropdown($settings) {

        // Create array of new styles
        $new_styles = array(
            array(
                'title' => __('Dar Blue', 'wpex'),
                'items' => array(
                    array(
                        'title' => __('Dar Blue Color', 'wpex'),
                        'classes' => 'dark-blue',
                        'inline' => 'span',
                    ),
                ),
            ),
            array(
                'title' => __('Burgundy title', 'wpex'),
                'items' => array(
                    array(
                        'title' => __('Burgundy Color', 'wpex'),
                        'classes' => 'content-title',
                        'inline' => 'span',
                    ),
                ),
            ),
        );

        // Merge old & new styles
        $settings['style_formats_merge'] = true;

        // Add new styles
        $settings['style_formats'] = json_encode($new_styles);

        // Return New Settings
        return $settings;
    }

}
add_filter('tiny_mce_before_init', 'wpex_styles_dropdown');
//-> End Editor
// Admin only functions
if (is_admin()) {

    // Load the gallery metabox only if the portfolio post type is enabled
    if (get_theme_mod('wpex_portfolio', '1') == '1') {
        require_once( get_template_directory() . '/functions/meta/gallery-metabox/gmb-admin.php' );
    }

    // Default meta options usage
    require_once( get_template_directory() . '/functions/meta/usage.php' );

    // Post editor tweaks
    require_once( get_template_directory() . '/functions/mce.php' );

// Non admin functions
} else {

    // Front-end Portfolio functions
    if (get_theme_mod('wpex_portfolio', '1') == '1') {

        // Displays portfolio gallery images
        require_once( get_template_directory() . '/functions/meta/gallery-metabox/gmb-display.php' );
    }

    // Outputs the main site logo
    require_once( get_template_directory() . '/functions/logo.php' );

    // Loads front end css and js
    require_once( get_template_directory() . '/functions/scripts.php' );

    // Custom Menu Walker
    require_once( get_template_directory() . '/functions/menu-walker.php' );

    // Image resizing script
    require_once( get_template_directory() . '/functions/aqua-resizer.php' );

    // Returns the correct image sizes for cropping
    require_once( get_template_directory() . '/functions/featured-image.php' );

    // Comments output
    require_once( get_template_directory() . '/functions/comments-callback.php' );

    // Pagination output
    require_once( get_template_directory() . '/functions/pagination.php' );

    // Custom excerpts
    require_once( get_template_directory() . '/functions/excerpts.php' );

    // Alter posts per page for various archives
    require_once( get_template_directory() . '/functions/posts-per-page.php' );

    // Outputs the footer copyright
    require_once( get_template_directory() . '/functions/copyright.php' );

    // Outputs post meta (date, cat, comment count)
    require_once( get_template_directory() . '/functions/post-meta.php' );

    // Used for next/previous links on single posts
    require_once( get_template_directory() . '/functions/next-prev.php' );

    // Outputs the post format video
    require_once( get_template_directory() . '/functions/post-video.php' );

    // Outputs post author bio
    require_once( get_template_directory() . '/functions/post-author.php' );

    // Outputs post slider
    require_once( get_template_directory() . '/functions/post-slider.php' );

    // Adds classes to entries
    require_once( get_template_directory() . '/functions/post-classes.php' );

    // Adds a mobile search to the sidr container
    require_once( get_template_directory() . '/functions/mobile-search.php' );

    // Displays the homepage slides
    require_once( get_template_directory() . '/functions/homepage-slider.php' );
}

//-> Organizar por orden

function my_cpt_column_slides($colname, $cptid) {
    if ($colname == 'slider_order')
        echo get_post_meta($cptid, 'slider_order', true);
}

add_action('manage_slides_posts_custom_column', 'my_cpt_column_slides', 10, 2);

function my_cpt_columns_slides($columns) {

    $title = $columns['title'];
    unset($columns['title']);
    $slides_thumbnail = $columns['slides_thumbnail'];
    unset($columns['slides_thumbnail']);

    $columns['title'] = $title;
    $columns['slider_order'] = 'Order';
    $columns['slides_thumbnail'] = $slides_thumbnail;
    return $columns;
}

add_filter('manage_edit-slides_columns', 'my_cpt_columns_slides');
add_filter('manage_edit-slides_sortable_columns', 'my_cpt_columns_slides');

function my_sort_by_order($vars) {
    if (array_key_exists('orderby', $vars)) {
        if ('Order' == $vars['orderby']) {
            $vars['orderby'] = 'meta_value';
            $vars['meta_key'] = 'slider_order';
        }
    }
    return $vars;
}

add_filter('request', 'my_sort_by_order');

//-> Fin de organizar por orden
//-> Campos para organizar las nuevas columnas
function my_cpt_column($colname, $cptid) {
    if ($colname == 'internal_title')
        echo get_post_meta($cptid, 'internal_title', true);
}

add_action('manage_tombstone_posts_custom_column', 'my_cpt_column', 10, 2);

function my_cpt_columns($columns) {
    $author = $columns['author'];
    unset($columns['author']);
    $date = $columns['date'];
    unset($columns['date']);

    $columns['internal_title'] = 'Internal title';
    $columns['author'] = $author;
    $columns['date'] = $date;
    return $columns;
}

add_filter('manage_edit-tombstone_columns', 'my_cpt_columns');
add_filter('manage_edit-tombstone_sortable_columns', 'my_cpt_columns');

function my_sort_internal_title($vars) {
    if (array_key_exists('orderby', $vars)) {
        if ('Internal title' == $vars['orderby']) {
            $vars['orderby'] = 'meta_value';
            $vars['meta_key'] = 'internal_title';
        }
    }
    return $vars;
}

add_filter('request', 'my_sort_internal_title');

function my_acf_load_field($field) {
    // reset choices
    $field['choices'] = array();
    $args = array(
        'post_type' => 'tombstone',
        'posts_per_page' => -1
    );
    $wp_query = new WP_Query($args);
    foreach ($wp_query->posts as $key => $post_item) {
        $post_id = $post_item->ID;
        $choice = $post_item->post_title;
        $tmp = get_field('internal_title', $post_id);
        if ($tmp != false && !empty($tmp)) {
            $choice = $tmp;
        }
        $field['choices'][$post_id] = $choice;
    }
    // Important: return the field
    return $field;
}

// v3.5.8.2 and below
add_filter('acf_load_field-tombstones_slider_servide', 'my_acf_load_field');

// v4.0.0 and above
add_filter('acf/load_field/name=tombstones_slider_servide', 'my_acf_load_field');


/* Tombstone_Exclude_Categories_Type */

function acf_load_exclude_categories_type($field) {
    // Reset choices
    $field['choices'] = array();
    $field_key = "field_54526ad6a6cf7";
    $field_copy = get_field_object($field_key);
    $choices_copy = $field_copy["choices"];
    // Populate choices
    foreach ($choices_copy as $key => $value) {
        $field['choices'][$key] = $value;
    }
    // Return choices
    return $field;
}

// Populate select field using filter
add_filter('acf/load_field/key=field_545a49cacd5da', 'acf_load_exclude_categories_type');
/* Tombstone_Exclude_Categories_Type */


/* Tombstone_Exclude_Categories_Industry */

function acf_load_exclude_categories_industry($field) {
    // Reset choices
    $field['choices'] = array();
    $field_key = "field_54526afea6cf8";
    $field_copy = get_field_object($field_key);
    $choices_copy = $field_copy["choices"];
    // Populate choices
    foreach ($choices_copy as $key => $value) {
        $field['choices'][$key] = $value;
    }
    // Return choices
    return $field;
}

// Populate select field using filter
add_filter('acf/load_field/key=field_545a49eccd5db', 'acf_load_exclude_categories_industry');
/* Tombstone_Exclude_Categories_Industry */


/* Tombstone_Exclude_Categories_Industry */

function acf_load_exclude_categories_professional($field) {
    // Reset choices
    $field['choices'] = array();
    $field_key = "field_54526b43a6cf9";
    $field_copy = get_field_object($field_key);
    $choices_copy = $field_copy["choices"];
    // Populate choices
    foreach ($choices_copy as $key => $value) {
        $field['choices'][$key] = $value;
    }
    // Return choices
    return $field;
}

// Populate select field using filter
add_filter('acf/load_field/key=field_545a4a1ccd5dc', 'acf_load_exclude_categories_professional');
/* Tombstone_Exclude_Categories_Industry */
