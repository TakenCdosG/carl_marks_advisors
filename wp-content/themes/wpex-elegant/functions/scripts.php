<?php

/**
 * This file loads custom css and js for our theme
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
add_action('wp_enqueue_scripts', 'wpex_load_scripts');

function wpex_load_scripts() {

    /**
      CSS
     * */
    wp_enqueue_style('style', get_stylesheet_uri());
    wp_enqueue_style('wpex-responsive', get_template_directory_uri() . '/responsive.css');
    wp_enqueue_style('wpex-print', get_template_directory_uri() . '/print.css');
    wp_enqueue_style('google-font-open-sans', 'http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&subset=latin,cyrillic-ext,greek-ext,greek,vietnamese,latin-ext,cyrillic');
    if (function_exists('wpcf7_enqueue_styles')) {
        wp_dequeue_style('contact-form-7');
    }

    /**
      jQuery
     * */
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
    wp_enqueue_script('wpex-plugins', WPEX_JS_DIR_URI . '/plugins.js', array('jquery'), '1.7.5', true);
    wp_enqueue_script('wpex-global', WPEX_JS_DIR_URI . '/global.js', array('jquery', 'wpex-plugins'), '1.7.5', true);
    wp_enqueue_script('jquery-modernizr', WPEX_JS_DIR_URI . '/modernizr.custom.79639.js', array(), '1.7.5', true);
    wp_enqueue_script('wpex-shuffle', WPEX_JS_DIR_URI . '/jquery.shuffle.js', array(), '1.7.5', true);
    //wp_enqueue_script('jquery-resize', WPEX_JS_DIR_URI . '/jquery.resizeimagetoparent.js', array(), '1.0', true); 
}

function people_sort($wp_query_organized) {

    if (count($wp_query_organized) > 0) {
        $post = array();
        $empty_last_name_post = array();
        $ite = 1;
        foreach ($wp_query_organized as $key => $post_item) {

            $post_title = $post_item->post_title;
            $post_id = $post_item->ID;

            $field = get_field_object('business', $post_id);
            $business = get_field('business', $post_id);

            $business_key = array();
            $business_label = "";
            if ($business != false) {
                if (is_array($business)) {
                    foreach ($business as $key => $value) {
                        $business_label = $business_label . '<h5 class="people-business">' . $field['choices'][$value] . '</h5>';
                        $business_key[] = '["' . $field['choices'][$value] . '"]';
                    }
                } else {
                    $business_label = '<h5 class="people-business">' . $field['choices'][$business] . '</h5>';
                    $business_key[] = '["' . $field['choices'][$business] . '"]';
                }
            }

            $business_key = implode(', ', $business_key);

            $position = get_field('position', $post_id);
            $first_name = get_field('first_name', $post_id);
            $last_name = get_field('last_name', $post_id);
            $custom_title = get_field('custom_title', $post_id);
            $contact = get_field('contact', $post_id);

            $field_office = get_field_object('office', $post_id);
            $office_label = get_field('office', $post_id);
            $office = $field_office['choices'][$office_label];

            $key_names = "";

            if (empty($last_name)) {

                $key_first_name = "zzz" . strtolower(clear_space($first_name));
                $key_last_name = "zzzz";
                $key_office = strtolower(clear_space($office));

                $empty_last_name_post[] = array(
                    'business_key' => $business_key,
                    'business' => $business,
                    'business_label' => $business_label,
                    'position' => $position,
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'post_title' => $post_title,
                    'post_id' => $post_id,
                    'key_first_name' => $key_first_name,
                    'key_last_name' => $key_last_name,
                    'key_office' => $key_office,
                    'custom_title' => $custom_title,
                    'office' => $office,
                    'contact' => $contact
                );
            } else {

                $key_first_name = strtolower(clear_space($first_name . $last_name));
                $key_last_name = strtolower(clear_space($last_name . $first_name));
                $key_office = strtolower(clear_space($office));

                $post[strtolower(clear_space($last_name . $ite))] = array(
                    'business_key' => $business_key,
                    'business' => $business,
                    'business_label' => $business_label,
                    'position' => $position,
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'post_title' => $post_title,
                    'post_id' => $post_id,
                    'key_first_name' => $key_first_name,
                    'key_last_name' => $key_last_name,
                    'key_office' => $key_office,
                    'custom_title' => $custom_title,
                    'office' => $office,
                    'contact' => $contact
                );
                $ite = $ite + 1;
            }
        }

        if (count($post) > 0) {
            ksort($post);
        }
        return array_merge($post, $empty_last_name_post);
    } else {
        return $wp_query_organized;
    }
}

function clear_space($cadena) {
    $cadena = str_replace(' ', '', $cadena);
    return $cadena;
}

function get_business_by_id($id) {
    $cadena = str_replace(' ', '', $cadena);
    return $cadena;
}

function get_accordion_elements(){
    $elements = array();
    $max = 10;
    $title_prefix = "title_section_";
    $content_prefix = "content_section_";
    for ($i=1; $i <= $max; $i++) { 
        $item = array();
        $item['title'] = get_field($title_prefix.$i);
        $item['content'] = get_field($content_prefix.$i);
        if(!empty($item['title']) && !empty($item['content'])){
            $elements[] = $item;
        }
    }
    return $elements;
}

function get_accordion_section($elements){
    // Enque scripts
    wp_enqueue_script( 'jquery-ui-accordion' );
    $html = '';
    $class = '';
    
    foreach ($elements as $key => $item) {
        if($key == 0){
            $class = 'symple-accordion symple-accordion-first-item';
        }else{
            $class = 'symple-accordion symple-accordion-item';
        }
        $html .= '<div class="'. $class .'">';
        $html .= '<h3 class="symple-accordion-trigger '. $class .'"><a href="#">'. $item['title'] .'</a></h3><div class="symple-clearfix">' . do_shortcode($item['content']) . '</div>';
        $html .= '</div>';
    }
    
    return $html;
}
