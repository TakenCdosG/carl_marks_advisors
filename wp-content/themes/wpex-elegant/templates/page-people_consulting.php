<?php
/**
 * Template Name: Standard page people(Consulting)
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
            'value' => 8,
            'compare' => 'LIKE'
        ),
    )
);
?>
<?php $wp_query = new WP_Query($args); ?>

<?php $wp_query_organized = people_sort($wp_query->posts); ?>
<?php //die(var_dump($wp_query_organized)); ?>
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
                    <?php $field_key = "field_53d06c3987466"; ?>
                    <?php $field = get_field_object($field_key); ?>
                    <?php $selected_init_value = "All"; ?>
                    <div class="row header-table">
                        <div class="wrapper-col-3">
                            <div class="col-lg-3">
                                <div class="wrapper-sort-by-name">
                                    <div class="label">SORT BY: </div>
                                    <div id="sort" class="wrapper-dropdown-sort" tabindex="1">
                                        <span>First Name</span>
                                        <ul class="dropdown sort-options">
                                            <li><a data-group="first_name" href="#">First Name</a></li>
                                            <li><a data-group="last_name" href="#">Last Name</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 wrapper-business-info">
                                <div class="label sort-title" orderby="none">Title <span class="downarrow"></span> </div>
                            </div>
                            <div class="col-lg-3 wrapper-contact-info">
                                <div class="label">Contact </div>
                            </div>
                        </div>
                    </div><!-- .row -->
                    <div class="row">
                        <div id="grid">
                            <?php if ($wp_query->have_posts()) : ?>
                                <?php $post_number = $wp_query->post_count; ?>
                                <?php $ite = 1; ?>
                                <?php $i = 1; ?>
                                <?php foreach ($wp_query_organized as $key => $post): ?>
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
                                    <!-- CONTENT -->
                                    <?php $position = $post['position']; ?>
                                    <?php $first_name = $post['first_name']; ?>
                                    <?php $last_name = $post['last_name']; ?>
                                    <?php $office = $post['office']; ?>
                                    <?php $contact = $post['contact']; ?>
                                    <?php $title = ""; ?>
                                    <?php if (!empty($post['custom_title'])): ?>
                                        <?php $title = strtolower(trim($post['custom_title'] . "_" . $first_name . "_" . $last_name)); ?>
                                    <?php else: ?>
                                        <?php $title = strtolower(trim($post['business_label'] . "_" . $first_name . "_" . $last_name)); ?>
                                    <?php endif; ?>
                                    <div class="wrapper-col-3 wrapper-content people-item" data-title='<?php echo $title; ?>' data-business='<?php echo $post['business_key']; ?>' data-groups='["all"]'  data-keyoffice="<?php if (!empty($post['key_office'])): ?><?php echo $post['key_office']; ?><?php endif; ?>" data-keyfirstname="<?php if (!empty($post['key_first_name'])): ?><?php echo $post['key_first_name']; ?><?php endif; ?>" data-keylastname="<?php if (!empty($post['key_last_name'])): ?><?php echo $post['key_last_name']; ?><?php endif; ?>">
                                        <div class="wrapper-people-item">
                                            <div class="col-lg-3">
                                                <div class="wrapper-sort-by-name">
                                                    <?php $src = wp_get_attachment_image_src(get_post_thumbnail_id($post['post_id']), 'full'); ?>
                                                    <?php $imgurl = $src[0]; ?>
                                                    <div class="post-img-wrapper-details do-media">
                                                        <?php if (!empty($imgurl) && !is_null($imgurl)): ?>
                                                            <a class="img-link" href="<?php echo get_the_permalink($post['post_id']) ?>">
                                                                <img class="img-responsive" src="<?php echo $imgurl; ?>"  alt="<?php echo $post['post_title'] ?>" />
                                                            </a>
                                                        <?php endif; ?>
                                                        <?php if (!empty($first_name) && !empty($last_name)): ?>
                                                            <div class="content-right">
                                                                <h4 class="font-weight-bold name"><a href="<?php echo get_the_permalink($post['post_id']) ?>"><?php if (!empty($first_name)): ?><?php echo $first_name ?><?php endif; ?> <?php if (!empty($last_name)): ?><?php echo " " . $last_name ?><?php endif; ?></a></h4>
                                                                <div class="content-right-hidden-lg">
                                                                    <div class="sort-item picture-item__title"><?php echo $last_name ?> <?php echo $first_name ?></div>
                                                                    <div class="label-wrapper business-info">
                                                                        <?php if (!empty($post['custom_title'])): ?>
                                                                            <?php echo $post['custom_title']; ?>
                                                                        <?php else: ?>
                                                                            <h5 class="people-position"><?php echo $position; ?></h5>
                                                                            <?php echo $post['business_label']; ?>
                                                                        <?php endif; ?>
                                                                    </div>
                                                                    <div class="contact-info-hidden-lg"> 
                                                                        <?php echo $contact; ?> 
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        <?php endif; ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-3 wrapper-business-info">
                                                <div class="label-wrapper business-info">
                                                    <?php if (!empty($post['custom_title'])): ?>
                                                        <?php echo $post['custom_title']; ?>
                                                    <?php else: ?>
                                                        <h5 class="people-position"><?php echo $position; ?></h5>
                                                        <?php echo $post['business_label']; ?>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                            <div class="col-lg-3 wrapper-contact-info">
                                                <div class="content-label contact-info"> <?php echo $contact; ?> </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- END CONTENT -->
                                    <?php $ite = $ite + 1; ?>
                                    <?php $i = $i + 1; ?>
                                <?php endforeach; ?>
                            <?php else : ?>
                                <h2 class="blog-title">Not Found</h2>
                            <?php endif; ?>
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
            
            var sort = new DropSort( $('#sort') );
            $(document).click(function() {
                // all dropdowns
                $('.wrapper-dropdown-sort').removeClass('active');
            });
        
            var $grid = $('#grid');
        
            // instantiate the plugin
            $grid.shuffle({
                group: 'all', // Filter group
                itemSelector: '.people-item',
                easing:'ease',
                sequentialFadeDelay: 150,
                speed: 0
            });
            
            $('.sort-office').click(function (e){
                e.preventDefault();
                
                var opts = {};
                opts = {
                    by: function($el) {
                        return $el.data('keyoffice').toLowerCase();
                    }
                };
                
                // Filter elements
                $grid.shuffle('sort', opts);
                console.log("//-> Sort by Office.");
                
            });
            
              
            $('.sort-title').click(function (e){
                var orderby =$(this).attr("orderby");
                var rever = false;
                if(orderby=="none"){
                    
                    rever = false;
                    $(this).attr("orderby","asc");
                    $('.sort-title .downarrow').css("border-width","6px 6px 0 6px");
                    
                }else if(orderby=="asc"){
                    rever = true;
                    $(this).attr("orderby","desc");
                    $('.sort-title .downarrow').css("border-width","0px 6px 6px 6px");
                }else{
                    rever = false;
                    $(this).attr("orderby","asc");
                    $('.sort-title .downarrow').css("border-width","6px 6px 0 6px");
                }
                e.preventDefault();
                var opts = {};
                opts = {
                    reverse: rever,
                    by: function($el) {
                        return $el.data('title').toLowerCase();
                    }
                };
                // Filter elements
                $grid.shuffle('sort', opts);
                console.log("//-> Sort by Title.");
            });
            
            $('.sort-options a').click(function (e) {
                e.preventDefault();
                $('.sort-options a').removeClass('active');
                $(this).addClass('active');
                //-> Buscar por Tipo de negocio y por año.
                var sort = $(this).attr('data-group').toLowerCase(),
                opts = {};
                
                // We're given the element wrapped in jQuery
                if ( sort === 'first_name' ) {
                    opts = {
                        by: function($el) {
                            return $el.data('keyfirstname').toLowerCase();
                        }
                    };
                } else if ( sort === 'last_name' ) {
                    opts = {
                        by: function($el) {
                            return $el.data('keylastname').toLowerCase();
                        }
                    };
                }
                // Filter elements
                $grid.shuffle('sort', opts);
            });
            
            //-> Init First Name
            var sort = 'first_name',
            opts = {};
            opts = {
                by: function($el) {
                    return $el.data('keyfirstname').toLowerCase();
                }
            };
            // Filter elements
            $grid.shuffle('sort', opts);
            //-> End First Name
            
        });

    </script>
</div>
<?php get_footer(); ?>