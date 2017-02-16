<?php
/**
 * Template Name: Standard page tombstone
 *
 * @package WordPress
 * @subpackage Elegant WPExplorer Theme
 * @since Elegant 1.0
 */
get_header(); 
?>

<?php
/* Include_Type */
$include_type = array();
$include_types = get_field('exclude_categories_type', $post->ID);
if (is_array($include_types)) {
    foreach ($include_types as $key => $value) {
        $include_type[] = $value;
    }
} else {
    $include_type[] = $include_types;
}
/* End_Include_Type */

/* Include_Industry */
$include_industry = array();
$include_industrys = get_field('exclude_categories_industry', $post->ID);
if (is_array($include_industrys)) {
    foreach ($include_industrys as $key => $value) {
        $include_industry[] = $value;
    }
} else {
    $include_industry[] = $include_industrys;
}
/* End_Include_Industry */

/* Include_Professional */
$include_professional = array();
$include_professionals = get_field('exclude_categories_professional', $post->ID);
if (is_array($include_professionals)) {
    foreach ($include_professionals as $key => $value) {
        $include_professional[] = $value;
    }
} else {
    $include_professional[] = $include_professionals;
}
/* End_Include_Professional */

if (get_query_var('paged')) {
    $paged = get_query_var('paged');
} elseif (get_query_var('page')) {
    $paged = get_query_var('page');
} else {
    $paged = 1;
}
$orderby = 'page-attributes';
$order = 'DES';
$ConsultingCategory = array(1, 2);
$temp = $wp_query;
$args = array(
    'post_type' => 'tombstone',
    'posts_per_page' => 6,
    'orderby' => $orderby,
    'order' => $order,
    'paged' => $paged,
    /*
    'meta_query' => array(
        'relation' => 'OR',
        array(
            'key' => 'category_tombstone',
            'value' => $ConsultingCategory[0],
            'compare' => 'LIKE'
        ),
        array(
            'key' => 'category_tombstone',
            'value' => $ConsultingCategory[1],
            'compare' => 'LIKE'
        ),       
    )*/
);

/* Query Type */
$query_type_field_name = "category_type_tombstone";
$query_type = "all";
$query_type_found = false;
if (get_query_var('type')) {
    $query_type = get_query_var('type');
    if ($query_type != "all") {
        $query_type_found = true;
        $type_query = array(
            'key' => $query_type_field_name,
            'value' => $query_type,
            'compare' => '='
        );
    }
}
if ($query_type_found) {
    $args['meta_query'][] = $type_query;
}
/* End Query Type */


/* Query Industry */
$query_industry_field_name = "category_industry_tombstone";
$query_industry = "all";
$query_industry_found = false;
if (get_query_var('industry')) {
    $query_industry = get_query_var('industry');
    if ($query_industry != "all") {
        $query_industry_found = true;
        $industry_query = array(
            'key' => $query_industry_field_name,
            'value' => $query_industry,
            'compare' => '='
        );
    }
}
if ($query_industry_found) {
    $args['meta_query'][] = $industry_query;
}

/* End Query Industry */

/* Query Professional */
$query_professional_field_name = "category_professional_tombstone";
$query_professional = "all";
$query_professional_found = false;
if (get_query_var('professional')) {
    $query_professional = get_query_var('professional');
    if ($query_professional != "all") {
        $query_professional_found = true;
        $professional_query = array(
            'key' => $query_professional_field_name,
            'value' => $query_professional,
            'compare' => '='
        );
    }
}
if ($query_professional_found) {
    $args['meta_query'][] = $professional_query;
}

/* End Query Professional */

if ($query_type_found || $query_industry_found || $query_professional_found) {
    $args['meta_query']['relation'] = 'AND';
}

$url_root_page = get_page_link();
?>

<?php $wp_query = new WP_Query($args); ?>
<?php
    if(is_user_logged_in()){
        $var = array(
            'args' => $args,
            'wp_query' => $wp_query,
        );
        //echo "<pre>".drupal_var_export($var)."</pre>";
    }
?>

<?php //die(var_dump($wp_query)); ?>
<?php $excerpt = get_field('excerpt'); ?>
<?php $has_excerpt = !empty($excerpt); ?>
<div id="top-header" class="top-header">
    <div class="content-area site-main clr container">
        <h3 class="post-title <?php if (!$has_excerpt):
    ?> no_has_excerpt<?php endif; ?>"><?php the_title(); ?></h3>
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
                    <div class="row header-table header-type-tombstone">
                        <div class="wrapper-col-3">
                            <div class="col-lg-3 wrapper-sort-label-info">
                                <div class="label">SORT BY: </div>
                            </div>
                            <div class="col-lg-3 wrapper-type-info">
                                <?php $field_key = "field_54526ad6a6cf7"; ?>
                                <?php $field = get_field_object($field_key); ?>
                                <?php $selected_init_value = "All"; ?>
                                <div class="title-sort">Type</div>
                                <div id="sort_by_type" class="wrapper-dropdown-sort" tabindex="1">
                                    <?php $choices = $field["choices"]; ?>
                                    <?php $list_type_options = ""; ?>
                                    <?php $found_query = false; ?>
                                    <?php foreach ($choices as $key => $value): ?>
                                        <?php $data_group_key = ''; ?>
                                        <?php $data_group_key = $key; ?>
                                        <?php $active_list_type = ''; ?>
                                        <?php if (in_array($data_group_key, $include_type)): ?>
                                            <?php if ($query_type == $data_group_key): ?>
                                                <span><?php echo $value; ?></span>
                                                <?php $active_list_type = 'active'; ?>
                                                <?php $found_query = true; ?>
                                            <?php endif; ?>
                                            <?php $list_type_options .= "<li><a data-group='$data_group_key' class='$active_list_type' href='#'>$value</a></li>"; ?>
                                        <?php else: ?>
                                        <?php endif; ?>
                                    <?php endforeach; ?>
                                    <?php if ($query_type == "all" || $found_query == false): ?>
                                        <span>Select</span>
                                    <?php endif; ?>
                                    <?php if (count($field) > 0 && count($choices) > 0): ?>
                                        <?php $label = $field["label"]; ?>
                                        <ul class="dropdown filter-options">
                                            <li><a data-group="all" href="#" <?php if ($query_type == "all" || $found_query == false): ?>active<?php endif; ?>>All</a></li>
                                            <?php echo $list_type_options; ?>
                                        </ul>
                                    <?php else: ?>
                                        <p>No items found in the Type category</p>
                                    <?php endif; ?>
                                </div>                                
                            </div>
                            <div class="col-lg-4 wrapper-industry-info">
                                <?php $field_key = "field_54526afea6cf8"; ?>
                                <?php $field = get_field_object($field_key); ?>
                                <?php $selected_init_value = "All"; ?>
                                <div class="title-sort">Industry</div>
                                <div id="sort_by_industry" class="wrapper-dropdown-sort" tabindex="1">
                                    <?php $choices = $field["choices"]; ?>
                                    <?php $list_industry_options = ""; ?>
                                    <?php $found_query = false; ?>
                                    <?php foreach ($choices as $key => $value): ?>
                                        <?php $data_group_key = ''; ?>
                                        <?php $data_group_key = $key; ?>
                                        <?php $active_list_industry = ''; ?>
                                        <?php if (in_array($data_group_key, $include_industry)): ?>
                                            <?php if ($query_industry == $data_group_key): ?>
                                                <span><?php echo $value; ?></span>
                                                <?php $active_list_industry = 'active'; ?>
                                                <?php $found_query = true; ?>
                                            <?php endif; ?>
                                            <?php $list_industry_options .= "<li><a data-group='$data_group_key' class='$active_list_industry' href='#'>$value</a></li>"; ?>
                                        <?php else: ?>
                                        <?php endif; ?>
                                    <?php endforeach; ?>
                                    <?php if ($query_industry == "all" || $found_query == false): ?>
                                        <span>Select</span>
                                    <?php endif; ?>
                                    <?php if (count($field) > 0 && count($choices) > 0): ?>
                                        <?php $label = $field["label"]; ?>
                                        <ul class="dropdown filter-options">
                                            <li><a data-group="all" href="#" <?php if ($query_industry == "all" || $found_query == false): ?>active<?php endif; ?>>All</a></li>
                                            <?php echo $list_industry_options; ?>
                                        </ul>
                                    <?php else: ?>
                                        <p>No items found in the Industry category</p>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <div class="col-lg-3 wrapper-professional-info">
                                <?php $field_key = "field_54526b43a6cf9"; ?>
                                <?php $field = get_field_object($field_key); ?>
                                <?php $selected_init_value = "All"; ?>
                                <div class="title-sort">Professional</div>
                                <div id="sort_by_professional" class="wrapper-dropdown-sort" tabindex="1">
                                    <?php $choices = $field["choices"]; ?>
                                    <?php $list_professional_options = ""; ?>
                                    <?php $found_query = false; ?>
                                    <?php foreach ($choices as $key => $value): ?>
                                        <?php $data_group_key = ''; ?>
                                        <?php $data_group_key = $key; ?>
                                        <?php $active_list_professional = ''; ?>
                                        <?php if (in_array($data_group_key, $include_professional)): ?>
                                            <?php if ($query_professional == $data_group_key): ?>
                                                <span><?php echo $value; ?></span>
                                                <?php $active_list_professional = 'active'; ?>
                                                <?php $found_query = true; ?>
                                            <?php endif; ?>
                                            <?php $list_professional_options .= "<li><a data-group='$data_group_key' class='$active_list_professional' href='#'>$value</a></li>"; ?>
                                        <?php else: ?>
                                        <?php endif; ?>
                                    <?php endforeach; ?>
                                    <?php if ($query_professional == "all" || $found_query == false): ?>
                                        <span>Select</span>
                                    <?php endif; ?>
                                    <?php if (count($field) > 0 && count($choices) > 0): ?>
                                        <?php $label = $field["label"]; ?>
                                        <ul class="dropdown filter-options">
                                            <li><a data-group="all" href="#" <?php if ($query_professional == "all" || $found_query == false): ?>active<?php endif; ?>>All</a></li>
                                            <?php echo $list_professional_options; ?>
                                        </ul>
                                    <?php else: ?>
                                        <p>No items found in the Professional category</p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div><!-- .row -->
                    <div class="clear clearfix"></div>
                    <div class="row wrapper-box-tombstone">
                        <div id="grid">
                            <?php if ($wp_query->have_posts()) : ?>
                                <?php $post_number = $wp_query->post_count; ?>
                                <?php $ite = 1; ?>
                                <?php $i = 1; ?>
                                <?php while ($wp_query->have_posts()): ?>
                                    <?php $wp_query->the_post(); ?>
                                    <!-- Sort Type -->
                                    <?php $types = get_field('category_type_tombstone', $post->ID); ?>
                                    <?php $str_type = ''; ?>
                                    <?php if (is_array($types)): ?>
                                        <?php $count = count($types); ?>
                                        <?php foreach ($types as $key => $value): ?> 
                                            <?php $tmp = $key + 1; ?> 
                                            <?php if ($count == $tmp): ?>
                                                <?php $str_type .='"choice_' . $value . '"'; ?>
                                            <?php else: ?>
                                                <?php $str_type .='"choice_' . $value . '", '; ?>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <?php $str_type .='"choice_' . $types . '"'; ?>
                                    <?php endif; ?>
                                    <!-- End Sort Type -->

                                    <!-- Sort Industrys -->
                                    <?php $industrys = get_field('category_industry_tombstone', $post->ID); ?>
                                    <?php $str_industry = ''; ?>
                                    <?php if (is_array($industrys)): ?>
                                        <?php $count = count($industrys); ?>
                                        <?php foreach ($industrys as $key => $value): ?> 
                                            <?php $tmp = $key + 1; ?> 
                                            <?php if ($count == $tmp): ?>
                                                <?php $str_industry .='"choice_' . $value . '"'; ?>
                                            <?php else: ?>
                                                <?php $str_industry .='"choice_' . $value . '", '; ?>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <?php $str_industry .='"choice_' . $industrys . '"'; ?>
                                    <?php endif; ?>
                                    <!-- End Sort Industrys -->

                                    <!-- Sort Industrys -->
                                    <?php $professionals = get_field('category_professional_tombstone', $post->ID); ?>
                                    <?php $str_professional = ''; ?>
                                    <?php if (is_array($professionals)): ?>
                                        <?php $count = count($professionals); ?>
                                        <?php foreach ($professionals as $key => $value): ?> 
                                            <?php $tmp = $key + 1; ?> 
                                            <?php if ($count == $tmp): ?>
                                                <?php $str_professional .='"choice_' . $value . '"'; ?>
                                            <?php else: ?>
                                                <?php $str_professional .='"choice_' . $value . '", '; ?>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <?php $str_professional .='"choice_' . $professionals . '"'; ?>
                                    <?php endif; ?>
                                    <!-- End Sort Industrys -->

                                    <!-- CONTENT -->
                                    <div class="wrapper-col-4 wrapper-content tombstone-item <?php if ($i == 3): ?> last-column <?php endif; ?>">
                                        <div class="wrapper-item-tombstone" data-groups='["all", <?php echo $str_industry; ?>, <?php echo $str_professional; ?>, <?php echo $str_type; ?>]' data-industrys='["all", <?php echo $str_industry; ?>]' data-types='["all", <?php echo $str_type; ?>]' data-professionals='["all", <?php echo $str_professional; ?>]'>
                                            <div class="col-lg-4 box-tombstone">
                                                <div class="wrapper-sort-by-name">
                                                    <h4 class="tombstone-box-title"><?php echo $post->post_title ?></h4>
                                                    <?php $src = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full'); ?>
                                                    <?php $imgurl = $src[0]; ?>
                                                    <a class="" href="javascript:void(0);<?php //the_permalink() ?>">
                                                        <img class="img-responsive" src="<?php echo $imgurl; ?>"  alt="<?php echo $post->post_title ?>" />
                                                    </a>
                                                    <div class="post-info-wrapper do-media">
                                                        <?php echo $post->post_excerpt ?>
                                                    </div>
                                                    <div class="read-more-wrapper">
                                                        <a class="learn-more" data-url="<?php echo get_permalink($post->ID) ?>" href="javascript: void(0)">LEARN MORE <i class="fa fa-angle-right"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- END CONTENT -->
                                    </div>
                                    <?php if ($i < 3): ?> 
                                        <?php $i = $i + 1; ?>
                                    <?php else: ?>
                                        <?php $i = 1; ?>
                                    <?php endif; ?>
                                <?php endwhile; ?>
                            <?php else : ?>
                                <h2 class="blog-title">Not Found</h2>
                            <?php endif; ?>
                        </div>
                        <div class="pagination">
                            <?php wpex_custom_pagination(); ?>
                        </div>
                    </div><!-- .row -->
                    <div class="clear clearfix"></div>
                </div><!-- .page-content -->
            </div><!-- #content -->
        </div><!-- #primary -->
    </div><!-- #main-content -->
    <script type="text/javascript">
        jQuery( function($) {
            /* Begin Sort*/
            function DropDown(el) {
                this.dd = el;
                this.initEvents();
            }
            DropDown.prototype = {
                initEvents : function() {
                    var obj = this;
                    obj.dd.on('click', function(event){
                        $(this).toggleClass('active');
                        event.stopPropagation();
                    }); 
                }
            }
            function DropSort(el) {
                this.dd = el;
                this.placeholder = this.dd.children('span');
                this.opts = this.dd.find('ul.dropdown > li');
                this.val = '';
                this.index = -1;
                this.initEvents();
            }
            DropSort.prototype = {
                initEvents : function() {
                    var obj = this;

                    obj.dd.on('click', function(event){
                        $(this).toggleClass('active');
                        event.stopPropagation();
                        //return false;
                    });

                    obj.opts.on('click',function(){
                        var opt = $(this);
                        obj.val = opt.text();
                        obj.index = opt.index();
                        obj.placeholder.text(obj.val);
                    });
                },
                getValue : function() {
                    return this.val;
                },
                getIndex : function() {
                    return this.index;
                }
            }
            /* End Sort */    
            
            var sort_by_industry = new DropSort($('#sort_by_industry'));
            var sort_by_professional = new DropSort($('#sort_by_professional'));
            var sort_by_type = new DropSort($('#sort_by_type'));
            
            var $grid = $('#grid');
            // instantiate the plugin
            $grid.shuffle({
                group: 'all', // Filter group
                itemSelector: '.tombstone-item',
                easing:'ease',
                sequentialFadeDelay: 150,
                speed: 0
            });
         
            function redirectPage(){
                var filters_pagination_type = "all";
                var option_pagination_filter_type = $('#sort_by_type .filter-options a.active');
                if(option_pagination_filter_type.length > 0){
                    var filters_pagination_type = option_pagination_filter_type.attr('data-group');
                }
                var filters_pagination_industry = "all";
                var option_pagination_filter_industry = $('#sort_by_industry .filter-options a.active');
                if(option_pagination_filter_industry.length > 0){
                    var filters_pagination_industry = option_pagination_filter_industry.attr('data-group');
                }         
                var filters_pagination_professional = "all";
                var option_pagination_filter_professional = $('#sort_by_professional .filter-options a.active');
                if(option_pagination_filter_professional.length > 0){
                    var filters_pagination_professional = option_pagination_filter_professional.attr('data-group');
                }
                window.location = "<?php echo $url_root_page; ?>?type="+filters_pagination_type+"&industry="+filters_pagination_industry+"&professional="+filters_pagination_professional;
            }
            
            //****By Type****//
            $('#sort_by_type .filter-options a').click(function (e) {
                e.preventDefault();

                // set active class
                $('#sort_by_type .filter-options a').removeClass('active');
                $(this).addClass('active');
                //-> Redirect Page
                redirectPage();
            });
            //****End By Type****//
            
            //****By Industry****//
            $('#sort_by_industry .filter-options a').click(function (e) {
                e.preventDefault();
                // set active class
                $('#sort_by_industry .filter-options a').removeClass('active');
                $(this).addClass('active');
                //-> Redirect Page
                redirectPage();
            });
            //****End By Industry****//
            
            //****By Professional****//
            $('#sort_by_professional .filter-options a').click(function (e) {
                e.preventDefault();
                // set active class
                $('#sort_by_professional .filter-options a').removeClass('active');
                $(this).addClass('active');
                //-> Redirect Page
                redirectPage();
            });
            //****End By Professional****//
            
            
        });
    </script>
</div>
<?php get_footer(); ?>
<?php get_footer(); ?>
