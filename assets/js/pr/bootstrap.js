/*!
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.4
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.4
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.4'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.4
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitterjava   %javax/naming/directory/SearchControls  4 2com/sun/jndi/toolkit/dir/LazySearchEnumerationImpl *com/sun/jndi/toolkit/dir/ContextEnumerator  5 *com/sun/jndi/toolkit/dir/ContainmentFilter  6  7 8 9 %com/sun/jndi/toolkit/dir/SearchFilter  : ; <   "com/sun/jndi/toolkit/dir/DirSearch java/lang/Object javax/naming/NamingException (IJI[Ljava/lang/String;ZZ)V (Ljavax/naming/Context;I)V &(Ljavax/naming/directory/Attributes;)V o(Ljavax/naming/NamingEnumeration;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;)V getSearchScope ()I (Ljava/lang/String;)V format 9(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String; !                    *� �           $ 	       D 	    (� Y	,� N� Y� Y*� � Y+� -� 	�       
    (  -            	       Z     ),� � Y� 
M� Y� Y*,� � � Y+� 
    C  D              !    "PK
    ��H@Ԧ�  �  :   com/sun/jndi/toolkit/dir/HierMemDirCtx$BaseFlatNames.class����   4 >	  (
  )	  *
  + , - .
  / 0
  1
  2 4 7 8 names Ljava/util/Enumeration; 	Signature ,Ljava/util/Enumeration<Ljavax/naming/Name;>; this$0 (Lcom/sun/jndi/toolkit/dir/HierMemDirCtx; <init> B(Lcom/sun/jndi/toolkit/dir/HierMemDirCtx;Ljava/util/Enumeration;)V Code LineNumberTable /(Ljava/util/Enumeration<Ljavax/naming/Name;>;)V hasMoreElements ()Z 
Exceptions nextElement ()Ljava/lang/Object; ()TT; next close ()V M<T:Ljava/lang/Object;>Ljava/lang/Object;Ljavax/naming/NamingEnumeration<TT;>; 
SourceFile HierMemDirCtx.java    $     javax/naming/NamingException 9   "    java/util/NoSuchElementException : ;  < = 4com/sun/jndi/toolkit/dir/HierMemDirCtx$BaseFlatNames 
*� �  �                         F     *� �L� Y+� 	� 
�                     E      ! "              !  # $     "     *� �       
   ! "      % &    ' 6   
   3 5PK
    ��H*f��	  �	  9   com/sun/jndi/toolkit/dir/HierMemDirCtx$FlatBindings.class����   4 o	  :
 ; <
  =	  >	  ?	  @	  A B C D
 ; E F G
  H
 I J K L M
  N
  O P
 Q R
  S
  T U W bds Ljava/util/Hashtable; 	Signature <Ljava/util/Hashtable<Ljavax/naming/Name;Ljava/lang/Object;>; env ;Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>; 
useFactory Z this$0 (Lcom/sun/jndi/toolkit/dir/HierMemDirCtx; <init> V(Lcom/sun/jndi/toolkit/dir/HierMemDirCtx;Ljava/util/Hashtable;Ljava/util/Hashtable;Z)V Code LineNumberTable {(Ljava/util/Hashtable<Ljavax/naming/Name;Ljava/lang/Object;>;Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>;Z)V next ()Ljavax/naming/Binding; 
Exceptions ()Ljava/lang/Object; 
SourceFile HierMemDirCtx.java " # Z [ \ $ ]       ! ^ _ ` a 4 javax/naming/Name b c &com/sun/jndi/toolkit/dir/HierMemDirCtx   d e f g h javax/naming/NamingException java/lang/Exception !Problem calling getObjectInstance $ i j k javax/naming/Binding X l m $ n ) * 3com/sun/jndi/toolkit/dir/HierMemDirCtx$FlatBindings FlatBindings 4com/sun/jndi/toolkit/dir/HierMemDirCtx$BaseFlatNames java/lang/Object !javax/naming/directory/Attributes java/util/Hashtable keys ()Ljava/util/Enumeration; B(Lcom/sun/jndi/toolkit/dir/HierMemDirCtx;Ljava/util/Enumeration;)V names Ljava/util/Enumeration; java/util/Enumeration nextElement get &(Ljava/lang/Object;)Ljava/lang/Object; 
� M,N*� � :,� 
    ��HyE�ʧ  �  6   com/sun/jndi/toolkit/dir/HierMemDirCtx$FlatNames.class����   4 J	  "
  #	  $ % & '	 ( )
 * +
 , -
 . / 0
 , 1
 
 2
  3 4 6 this$0 (Lcom/sun/jndi/toolkit/dir/HierMemDirCtx; <init> B(Lcom/sun/jndi/toolkit/dir/HierMemDirCtx;Ljava/util/Enumeration;)V Code LineNumberTable 	Signature /(Ljava/util/Enumeration<Ljavax/naming/Name;>;)V next ()Ljavax/naming/NameClassPair; 
Exceptions 7 ()Ljava/lang/Object; 
SourceFile HierMemDirCtx.java     8 9 : ;  javax/naming/Name < = > ? @ A B C D E F G javax/naming/NameClassPair H G  I   0com/sun/jndi/toolkit/dir/HierMemDirCtx$FlatNames 	FlatNames 4com/sun/jndi/toolkit/dir/HierMemDirCtx$BaseFlatNames javax/naming/NamingException names Ljava/util/Enumeration; java/util/Enumeration nextElement &com/sun/jndi/toolkit/dir/HierMemDirCtx bindings Ljava/util/Hashtable; java/util/Hashtable get &(Ljava/lang/Object;)Ljava/lang/Object; java/lang/Object getClass ()Ljava/lang/Class; java/lang/Class getName ()Ljava/lang/String; toString '(Ljava/lang/String;Ljava/lang/String;)V 0                   ,     *+� *+,� �          ' ( )             L     ,*� �  � L*� � +� � � 	M� 
Y+� ,� �          - 
    ��H��B!  !  B   com/sun/jndi/toolkit/dir/HierMemDirCtx$HierContextEnumerator.class����   4 )	  
  
   
   
  " # this$0 (Lcom/sun/jndi/toolkit/dir/HierMemDirCtx; <init> B(Lcom/sun/jndi/toolkit/dir/HierMemDirCtx;Ljavax/naming/Context;I)V Code LineNumberTable 
Exceptions $ U(Lcom/sun/jndi/toolkit/dir/HierMemDirCtx;Ljavax/naming/Context;ILjava/lang/String;Z)V getImmediateChildren 8(Ljavax/naming/Context;)Ljavax/naming/NamingEnumeration; 	Signature P(Ljavax/naming/Context;)Ljavax/naming/NamingEnumeration<Ljavax/naming/Binding;>; 
SourceFile HierMemDirCtx.java 	 
  %  & &com/sun/jndi/toolkit/dir/HierMemDirCtx ' ( <com/sun/jndi/toolkit/dir/HierMemDirCtx$HierContextEnumerator HierContextEnumerator InnerClasses   *com/sun/jndi/toolkit/dir/ContextEnumerator javax/naming/NamingException (Ljavax/naming/Context;I)V -(Ljavax/naming/Context;ILjava/lang/String;Z)V doListBindings #(Z)Ljavax/naming/NamingEnumeration; !      	 
        
      PK
    ��H�F�K  �K  ,   com/sun/jndi/toolkit/dir/HierMemDirCtx.class����   4E	 F	 G	 HIJ
 K
 L
 �M	 N	 O	 P	 Q
 R	 ST
 UV?@  
 WXY
 Z
 [
 \ a]
 ^ a_ a`a
 �b
 K
cdefg
 !K
 !h
 i
 j
 k almn
 *K
co
pq
pr
 s
 t
 u g]v
 w
 !xy
 7K
 z{|
 :K
 }
 ~
 �
 �
 ��
 �
 �
 ��
 ���
 �
 �
 ��
 �
 M�
 �
 ��
 R�
 �
 �
 �
 �
 �
 ��
 �
 ��
 ]K
 � a�� a�
 �
 �
 � g��
 �
 � g� g���
 lK g�������
 p�
 �
 �
 �
 p�
 p� s� s� s��� s� s] g� s���
 �K
 �
 ��
 �M
 ����
 ��
 ���
 �K�
 ��
 ��
 ��
 �
 �
 ��
 �M a� a�
 M�
 �M� HierContextEnumerator InnerClasses FlatBindings 	FlatNames� 
ignoreCase 
readOnlyEx Ljavax/naming/NamingException; myParser alwaysUseFactory close ()V Code LineNumberTable 
Exceptions getNameInNamespace ()Ljava/lang/String; <init> (Z)V (Ljava/util/Hashtable;Z)V ?(Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>;Z)V (Ljava/util/Hashtable;ZZ)V @(Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>;ZZ)V init lookup &(Ljava/lang/String;)Ljava/lang/Object; '(Ljavax/naming/Name;)Ljava/lang/Object; doLookup ((Ljavax/naming/Name;Z)Ljava/lang/Object; 
lookupLink 
SourceFile HierMemDirCtx.java &com/sun/jndi/toolkit/dir/HierMemDirCtx � � � � � � +javax/naming/OperationNotSupportedException Cannot determine full name � � � � � � � � � � � � � � � � � � &javax/naming/directory/BasicAttributes � � java/util/Hashtable ����� � � � �56�������� "javax/naming/NameNotFoundException� ���� javax/naming/NamingException java/lang/Exception !Problem calling getObjectInstance�� � � � � � ��� !javax/naming/InvalidNameException Cannot bind empty name�����
7686 � � !javax/naming/directory/DirContext�� &javax/naming/NameAlreadyBoundException�� /javax/naming/directory/SchemaViolationException ;This context only supports binding objects of it's own kind � � � � � � Cannot rebind empty name � � � � Cannot unbind empty name � ��� � � Cannot rename empty name�� Cannot rename across contexts � � � � � � 0com/sun/jndi/toolkit/dir/HierMemDirCtx$FlatNames�� �� � � � � 3com/sun/jndi/toolkit/dir/HierMemDirCtx$FlatBindings �� � � � � � � � � � �34   � � javax/naming/CompositeName �� javax/naming/Name�6


 2com/sun/jndi/toolkit/dir/LazySearchEnumerationImpl *com/sun/jndi/toolkit/dir/ContainmentFilter � �
 9  : �     !  � �  �   "     
� Y� �    �       = �     !  � �  �   $     *� �    �   
    B  C  � �  �   $     *� �    �   
    F  G  � �  �   $     *+� �    �   
    J  K �    �  � �  �   a     )*� 	*� 
*� *� � 
*� *� �    �   & 	   N  0 	 1  2  O  P  Q # R ( S �    �  � �  �   ?     *� Y*� 
� � *� Y� � �    �       V  W  X  � �  �   '     **� 
�  � �    �       [ �     !  � �  �   "     
*+*� � �    �       _ �     !  � �  �  �     �N*+� L+�  �    +                *N� :*� +� N� .*� +�  � � :� N� +�  � N-� � Y+� � �� <-+**� -� � 
�  ,� &�    �   
    �  � �     !  � �  �   (     *+,*� � '�    �   
    �  � �     !  � �  �   -     **� 
�  ,-� (�    �   
    �  � �     !  � �  �   (     *+,-*� � '�    �   
    �  � �     !  � �  �   �     `+� ) � 
*+-� 5�    �   .    � 	 �  �  � % � + � 1 � @ � K � X � _ � �   
 � - � �     !  � �  �   �     H*� � *� � 6� !�*� +� � � 7Y+� � 8�,� � *� +,� 9W� 
�  ,� =�    �   
    �  � �     !  � �  �   (     *+,*� � >�    �   
    �  � �     !  � �  �   -     **� 
�  ,-� ?�    �   
    �  � �     !  � �  �   (     *+,-*� � >�    �   
    �  � �     !  � �  �   �     `+� ) � 
*+-� 5�    �   .    � 	 �  �  � % � + � 1 � @ � K � X � _ � �   
 � - � �     !  � �  �   h     1*� � *� � 6� !�,� � *� +,� 9W� 
�  � B�    �   
   	 
 �     !  � �  �   `     ++� ) � 
�  *� 
     ! �     !  � �  �   �     S,� ) � +� ) � 
 "�  � �     !  � �  �   '     **� 
�  � K�    �      J �     ! �    �  � �  �   +     *+� � M,� L�    �   
   N 
O �     ! �    �  � �  �   (     � MY**� � N� O�    �      S �     ! �    �  � �  �   '     **� 
�  � P�    �      X �     ! �    �  � �  �   /     *+� � M,*� � Q�    �   
   \ 
] �     ! �    �  � �  �   *     � RY**� *� � S�    �      b �     ! �    �  � �  �   +     **� 
�  � T�    �   
   f g �     !  � �  �   <     **+� 0� � M,*+� 1� U�    �      j k l m �     !  � �  �   S     "*� � *� � 6� !�*+� L*� +� EW�    �      q r t u !v �     �     !  � �  �   '     **� 
�  � V�    �      y �     !  � �  �        *+� W�    �      } �     !  � �  �   (     **� 
�  ,� W�    �      � �     !  � �  �   9     **+� 0� � N-*+� 1,� X�    �      � � � �     !  � �  �   �     L*� � *� � 6� !�*+� L*� +� � � 7Y+� � 8�*� YN*� +-� 9W,� -Z,� [-�    �   * 
  � � � � #� /� 4� >� B� J� �   
 �  � �     !  � �  �   '     **� 
�  � \�    �      � �     !  � �  �        *+� �    �      � �     !  � �  �        *� 
   � � �     !    �   K     #*+� L*,� M,� ` � a� aN-+� b W-�    �      � � � � !� �     !   �   o     -**� � � Y� � 
  �   '     **� 
�  � d�    �      � �     ! 
  �   +     *+� � M,� e�    �   
   � 
� �     ! 
  �   (     **� 
�  ,� h�    �      � �     ! 
  �   ,     *+� � N-,� i�    �   
   � 
� �     ! 
� MN6+�� #*� +2� j N-� ,-� k W����,�    �   * 
  � � 	�    ! / 3 ; A �    	�  � �  �     !   �   -     **� 
�  -� 5�    �   
    
�  ,� u�    �   
   # $ �     !   �   0     *+� � N-,� v�    �      ( 
) * �     !   �   I     *� � *� � 6� !�+*� � wW�    �      / 0 3 4 �     �     !   �  w    *6*��!*2M,� x:,� y�     �            e   �+� z � j N-� +� { � s� k W� �� | :� } � �-� r � ~ W����  � +� z � � W� �+� { � s� k W� x+� z � j N-� f�  � +� z � � W� K� | :� } � -� r � � W���-�  � +� z � � W� 
> ? A 4G BH FI ZL cM mN ~S �T �V �X �Z �[ �\ �] �` �a �b �dek"=(o �   � 
�  ,-� ��    �      � �     ! �   % &  �   d     8*+� � :� �Y� �:-� �� �Y� Q� �Y,� �**� � ��    �      � � � � !� 7� �     ! �   ' (  �   �     ?*+� � 4:� �Y,� �:� �Y� �Y*-� 
-� �� � �-**� *� � ��    �      � � � %� >� �   Y � +  � �)*+      �*�    � �)*+      �* �     ! �   , -  �   -     ,-� �:*+� ��    �   
   � � �     ! �   . /  �   )     **� 
�  ,-� ��    �      � �     ! �   0 1  �   +     **� 
�  ,-� ��    �      � �     ! �   2 34  �   (     � Y*� *� 
� ��    �      � �     ! 56  �   �     :+M+� �� 2� �Y� �M+�  >6� ,+� � � � W����,�    �   "   � � 	� � � !� 2� 8� �   
   � � ? �  �   "     *� 
�    �   
   � � @A  �   "     *+� 
   � � B �  �   #      � �Y� �� �    �       + C   D �   *  �  �  R  �  M  �  �  �p�� 	PK
    ��H�x��  �  1   com/sun/jndi/toolkit/dir/HierarchicalName$1.class����   4 
   
  
      <init> ()V Code LineNumberTable hasMoreElements ()Z nextElement ()Ljava/lang/String; ()Ljava/lang/Object; 	Signature =Ljava/lang/Object;Ljava/util/Enumeration<Ljava/lang/String;>; 
SourceFile HierMemDirCtx.java EnclosingMethod   	  java/util/NoSuchElementException   +com/sun/jndi/toolkit/dir/HierarchicalName$1 InnerClasses java/lang/Object java/util/Enumeration )com/sun/jndi/toolkit/dir/HierarchicalName             	  
        *� �          ~   
        �               
         � Y� �          �A    
        *� �          ~                     
        PK
    ��H6
  4	 5 6
  7	  8
  9
  :	 ; <
 = >
 = ?
 = @
  A B C D	  6
  7
  E
  C F InnerClasses 	hashValue I serialVersionUID J 
Exceptions G hashCode ()I 
SourceFile HierMemDirCtx.java +com/sun/jndi/toolkit/dir/HierarchicalName$1   J K L       # M N O P Q H R S T ' U V , - W X Y )com/sun/jndi/toolkit/dir/HierarchicalName . - javax/naming/CompoundName !javax/naming/InvalidNameException java/lang/String [C /com/sun/jndi/toolkit/dir/HierarchicalNameParser mySyntax Ljava/util/Properties; toString ()Ljava/lang/String; java/util/Locale ENGLISH Ljava/util/Locale; toUpperCase &(Ljava/util/Locale;)Ljava/lang/String; length getChars (II[CI)V javax/naming/Name getAll ()Ljava/util/Enumeration; 0                             4     *� Y� � � *� �          ~ z �          ,     *+,� *� �          � z � !    "    #     ,     *+,� *� �          � z � $     %  & '     �     N*� � D*� � � 	L+� 
=>�:+� 6� **� %h�4`� �����*� �       * 
  � � � � � � (� 0� C� I� (    � +  ) * +  �   )    , -     4     *� � 
   � �  . -     4     *� � 
   � �  / 0     (     � Y*� *� � �          �  1    2    
        PK
    ��H �&  &  5   com/sun/jndi/toolkit/dir/HierarchicalNameParser.class����   4 =
  $ %	  &
  ' (
  $ ) *
  + , - . / 0 1 2 3 4 5 6 7 8 mySyntax Ljava/util/Properties; <init> ()V Code LineNumberTable parse '(Ljava/lang/String;)Ljavax/naming/Name; 
Exceptions 9 <clinit> 
SourceFile HierMemDirCtx.java   )com/sun/jndi/toolkit/dir/HierarchicalName    : java/util/Properties jndi.syntax.direction 
� 	W� 
� �  � +� 6� A� L�  "    #PK
    ��H����    8   com/sun/jndi/toolkit/dir/LazySearchEnumerationImpl.class����   4 �
 . g	 - h	 - i	 - j	 - k l
  g	 - m
 
 n o	 - p	 - q
 - r
 - s
 - t u v
  w
  x / y / t / z {
  | } ~   � �
  � �
  �
  x
 � � � �
  x
  � �
  �
  �
 � �
 & �
 - �
 - � � � � 
candidates  Ljavax/naming/NamingEnumeration; 	Signature 8Ljavax/naming/NamingEnumeration<Ljavax/naming/Binding;>; 	nextMatch %Ljavax/naming/directory/SearchResult; cons 'Ljavax/naming/directory/SearchControls; filter %Lcom/sun/jndi/toolkit/dir/AttrFilter; context Ljavax/naming/Context; env Ljava/util/Hashtable; ;Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>; 
useFactory Z <init> o(Ljavax/naming/NamingEnumeration;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;)V Code LineNumberTable 
Exceptions �(Ljavax/naming/NamingEnumeration<Ljavax/naming/Binding;>;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;)V �(Ljavax/naming/NamingEnumeration;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;Ljavax/naming/Context;Ljava/util/Hashtable;Z)V � o � �(Ljavax/naming/NamingEnumeration<Ljavax/naming/Binding;>;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;Ljavax/naming/Context;Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>;Z)V �(Ljavax/naming/NamingEnumeration;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;Ljavax/naming/Context;Ljava/util/Hashtable;)V �(Ljavax/naming/NamingEnumeration<Ljavax/naming/Binding;>;Lcom/sun/jndi/toolkit/dir/AttrFilter;Ljavax/naming/directory/SearchControls;Ljavax/naming/Context;Ljava/util/Hashtable<Ljava/lang/String;Ljava/lang/Object;>;)V hasMore ()Z hasMoreElements u nextElement '()Ljavax/naming/directory/SearchResult; next close ()V 
SourceFile LazySearchEnumerationImpl.java A [ 4 5 ? @ 0 1 8 9 %javax/naming/directory/SearchControls 6 7 � c java/util/Hashtable < = : ; A L \ ] S T javax/naming/NamingException  java/util/NoSuchElementException � � A � Z [ Y c javax/naming/Binding � c !javax/naming/directory/DirContext   � � � � � � T javax/naming/CompositeName � � � � � java/lang/Exception .problem generating object using object factory � � #javax/naming/directory/SearchResult � � � � � � � A � Y X W X 2com/sun/jndi/toolkit/dir/LazySearchEnumerationImpl java/lang/Object javax/naming/NamingEnumeration #com/sun/jndi/toolkit/dir/AttrFilter javax/naming/Context !javax/naming/directory/Attributes javax/naming/Name clone toString ()Ljava/lang/String; (Ljava/lang/String;)V 	getObject 
� 
� *� *� -� *� Y� � � *-� �    D   6 
    `  a J      2    R  S T  C   1     *� � � �    D       e E    @ J       U T  C   <     *� �L�        D       j  k  l E    E V  W X  C   G     *� �L� Y+� � �        D       r  s  t E    F V  Y X  C        *� �    D       z J       Z [  C   :     *� � *� �  �    D       ~    � E     J       \ ]  C  �     �*� � *� M� *� ,�*� �  � �*� �  � N-� :� ���� � �  :*� �  ���*� � � 	:� T*� � M*� � � Y-� �  � :*� *� � !:� :�:� Y#� $:� %�� &Y-� -� '*� � (� )� *M� *,� ,��  t � �  t � � "  D   �     �  �  �  �  �  � # � 0 � 6 � > � O � ] � g � m � t � � � � � � � � � � � � � � � � � � � � � � � � � � � � � � � � � � � E   P 
�  ^� � U  F  _ O `  @ aW VD b� '  F ^ _ O `  �   F   J     A Y c  C        *� +�    D       2 J     A W c  C        *� ,�    D       2  2    d e    fPK
    ��HSpg(5  5  8   com/sun/jndi/toolkit/dir/SearchFilter$AtomicFilter.class����   4 � W	 7 X
 8 Y
  Z
  [
  \	 7 ]
  ^	 7 _	 7 ` a b
  c
 d e
  f g h i
  Y j
  k	  l
  m n	  o p
  q
  c
  r s t u v w x y x z
 8 q
 7 {
 d | }
 & ~
 & q
 d 
 d �
 d � � �
 , �
 d �	 � �
 d �
 , �
 d �
 , �
 d �
 d � � � � attrID Ljava/lang/String; value 	matchType I this$0 'Lcom/sun/jndi/toolkit/dir/SearchFilter; <init> *(Lcom/sun/jndi/toolkit/dir/SearchFilter;)V Code LineNumberTable parse ()V 
Exceptions check &(Ljavax/naming/directory/Attributes;)Z � � w � � substringMatch '(Ljava/lang/String;Ljava/lang/String;)Z � 
SourceFile SearchFilter.java %com/sun/jndi/toolkit/dir/SearchFilter ? @ A F � B � � � � = > � � : ; < ; +javax/naming/OperationNotSupportedException Extensible match not supported A � � � � � � java/lang/Exception 3javax/naming/directory/InvalidSearchFilterException java/lang/StringBuilder Unable to parse character  � � � > � �  in " � ; " � � � � � � � � � � javax/naming/NamingException � � � � � R S � � java/lang/Character A � � � � � � � java/util/StringTokenizer * A � � � � � � � � � � � � � � � � � � 2com/sun/jndi/toolkit/dir/SearchFilter$AtomicFilter AtomicFilter InnerClasses java/lang/Object 2com/sun/jndi/toolkit/dir/SearchFilter$StringFilter StringFilter  javax/naming/directory/Attribute !javax/naming/directory/Attributes java/util/Enumeration java/lang/String 
access$000 
relIndexOf (I)I 	relCharAt (I)C relSubstring (II)Ljava/lang/String; (Ljava/lang/String;)V trim ()Ljava/lang/String; consumeChars (I)V append -(Ljava/lang/String;)Ljava/lang/StringBuilder; pos (I)Ljava/lang/StringBuilder; filter toString setRootCause (Ljava/lang/Throwable;)V get 6(Ljava/lang/String;)Ljavax/naming/directory/Attribute; getAll "()Ljavax/naming/NamingEnumeration; hasMoreElements ()Z nextElement ()Ljava/lang/Object; 	compareTo (Ljava/lang/String;)I (C)V equals (Ljava/lang/Object;)Z indexOf equalsIgnoreCase (Ljava/lang/String;)Z ((Ljava/lang/String;Ljava/lang/String;Z)V charAt java/util/Locale ENGLISH Ljava/util/Locale; toLowerCase &(Ljava/util/Locale;)Ljava/lang/String; 	nextToken 
startsWith 
*+� *� �    D        E F  C      L*� � *� )� <*� =� =*� d� >�   �      :   �   <   u   >   O   ~   )*� **� d� � 	**� `� � 
� z*� **� d� � 	**� `� � 
� T*� **� d� � 	**� `� � 
� .� Y� 
**� 	� � 	**� 
� � 
*� � � @L� Y� Y� � *� � � � *� � � � � � M,+� ,��     D   z       & P U d s v  {! �" �# �' �( �) �* �. �2 �3 �4 �8 �9<G>ADEIFKK G    � P%%%	 �    H  I< J       K L  C       �+*� 	�  N-� �-�  M� N�,� ! � [,� " � #N*� �     G               -   :**� 
-� $� �-*� 
� %� �-*� 
� %� �����              D   J   Q R S U Z V Y \ '] 1_ Tb `d bi mj oo zp |w x G   + �   M� 	  H N  O�  P� 5 Q
  U    V �     7  �  9  �PK
    ��H�&Ы    :   com/sun/jndi/toolkit/dir/SearchFilter$CompoundFilter.class����   4 M ,	  -
  . /
  .	  0	  1
  2
  3
  4
  5
  6
  7
  8 9  : ; = 
subFilters Ljava/util/Vector; 	Signature StringFilter InnerClasses HLjava/util/Vector<Lcom/sun/jndi/toolkit/dir/SearchFilter$StringFilter;>; polarity Z this$0 'Lcom/sun/jndi/toolkit/dir/SearchFilter; <init> +(Lcom/sun/jndi/toolkit/dir/SearchFilter;Z)V Code LineNumberTable parse ()V 
Exceptions > check &(Ljavax/naming/directory/Attributes;)Z 9 ? 
SourceFile SearchFilter.java %com/sun/jndi/toolkit/dir/SearchFilter    " java/util/Vector     @ " A B C D E F G H I J K L 2com/sun/jndi/toolkit/dir/SearchFilter$StringFilter & ' 4com/sun/jndi/toolkit/dir/SearchFilter$CompoundFilter CompoundFilter java/lang/Object 3javax/naming/directory/InvalidSearchFilterException javax/naming/NamingException consumeChar getCurrentChar ()C createNextFilter 6()Lcom/sun/jndi/toolkit/dir/SearchFilter$StringFilter; 
addElement (Ljava/lang/Object;)V 
access$000 *(Lcom/sun/jndi/toolkit/dir/SearchFilter;)V size ()I 	elementAt (I)Ljava/lang/Object; 0                                 >     *+� *� *� Y� � *� �            � 	 �  �  �  ! "     h     .*� � *� � 	)� *� � 
L*� +� *� � ��ݱ            �  �  �  � # � * � - � #    % $     %  & '     �     ?=*� � 
    ��H�=d]    5   com/sun/jndi/toolkit/dir/SearchFilter$NotFilter.class����   4 /	  
  
   !
   "	  # 	 $ % ' ( filter StringFilter InnerClasses 4Lcom/sun/jndi/toolkit/dir/SearchFilter$StringFilter; this$0 'Lcom/sun/jndi/toolkit/dir/SearchFilter; <init> *(Lcom/sun/jndi/toolkit/dir/SearchFilter;)V Code LineNumberTable parse ()V 
Exceptions ) check &(Ljavax/naming/directory/Attributes;)Z 
SourceFile SearchFilter.java     + ,  - . 
 
 
*+� *� �           �        3     *� � **� � � �           �  �  �              6     *� +�  � � �           �     @                  	       & PK
    ��H�F6�y  y  8   com/sun/jndi/toolkit/dir/SearchFilter$StringFilter.class����   4     parse ()V 
Exceptions  
SourceFile SearchFilter.java  2com/sun/jndi/toolkit/dir/SearchFilter$StringFilter StringFilter InnerClasses java/lang/Object #com/sun/jndi/toolkit/dir/AttrFilter 3javax/naming/directory/InvalidSearchFilterException %com/sun/jndi/toolkit/dir/SearchFilter                       	 
   
 PK
    ��Hz�tq    +   com/sun/jndi/toolkit/dir/SearchFilter.class����   4) �
  �
 O �	  �	  �
  �
  �	  � U �
  � �
  �
  �
  �
  �
 � �
  � � �
  �
  � �
  � U � �
  � �
  � � � � � �
 ; �
 ; �
 ; � � � � � � � � � � � � + � + � � + � � + �
  � � �
 7 � � �
 7 �
  �
 7 � �
 O �
 ; � �
 7 � � � � �
  � �
 � � � � �
 ; � �
 K � � � � � �  AtomicFilter InnerClasses 	NotFilter CompoundFilter StringFilter filter Ljava/lang/String; pos I 
rootFilter 4Lcom/sun/jndi/toolkit/dir/SearchFilter$StringFilter; debug Z 
LESS_TOKEN   < 
LESS_MATCH    <init> (Ljava/lang/String;)V Code LineNumberTable 
Exceptions check &(Ljavax/naming/directory/Attributes;)Z 
relIndexOf (I)I relSubstring (II)Ljava/lang/String; format 7(Ljavax/naming/directory/Attributes;)Ljava/lang/String; � � hexDigit (Ljava/lang/StringBuffer;B)V getEncodedStringRep &(Ljava/lang/Object;)Ljava/lang/String; � � 
access$000 *(Lcom/sun/jndi/toolkit/dir/SearchFilter;)V 
SourceFile SearchFilter.java %com/sun/jndi/toolkit/dir/SearchFilter � � � � W X Y Z � � � � [ \ � � � � java/lang/StringBuilder	

 =*) � � = ) [B java/lang/StringBuffer � � � � java/lang/String  \2a! \28 \29 \5c \00 � � unbalanced {: "#$ java/lang/NumberFormatException integer expected inside {}:  number exceeds argument list: % &javax/naming/directory/BasicAttributes&'( java/lang/Object #com/sun/jndi/toolkit/dir/AttrFilter 2com/sun/jndi/toolkit/dir/SearchFilter$StringFilter javax/naming/NamingException javax/naming/NamingEnumeration !javax/naming/directory/Attributes [Ljava/lang/Object; append (C)Ljava/lang/StringBuilder; -(Ljava/lang/String;)Ljava/lang/StringBuilder; toString ()Ljava/lang/String; java/lang/Character isWhitespace (C)Z (I)Ljava/lang/StringBuilder; +(Lcom/sun/jndi/toolkit/dir/SearchFilter;Z)V parse charAt indexOf (II)I 	substring size ()I getAll "()Ljavax/naming/NamingEnumeration; hasMore ()Z next ()Ljava/lang/Object; get getID (C)Ljava/lang/StringBuffer; length ,(Ljava/lang/String;)Ljava/lang/StringBuffer; java/lang/Integer parseInt (Ljava/lang/String;)I (I)Ljava/lang/String; 6(Ljava/lang/String;)Ljavax/naming/directory/Attribute; put F(Ljavax/naming/directory/Attribute;)Ljavax/naming/directory/Attribute; !  O  P    W X     Y Z    [ \    ] ^  _    `  a b  _    c  d b  _    e  f b  _    g  h b  _    i  j b  _    k  l b  _    m  n b  _    o  p b  _    q  r b  _    s  t b  _    u  v b  _    w  x Z  _    y  z Z  _    {  | Z  _    }  ~ Z  _       � �  �   G     *� *+� *� *� **� � �    �       A  B 	 C  D  E  F �       � �  �   :     +� �*� +� 	 �    �       J  K  M �     �     �  � �  �   Z     -*� *� 
(� "*� Y� (� 
� � 
*� ���    �       d 
 e  g �       � �  �  �    *� *� 
(� !� Y� Y� � *� � � � �*� *� *� 
�   Y      !   G   &   !   |   4� Y*� L+�  � 7� Y*� L+�  � $� Y*� L+�  � � Y*� L+�  *� *� 
)� !� Y� Y� � *� � � � �*� � 6M,�M� Y� Y� � *� �  � *� � !� � � �+�   � �   � �   �   n    m  q 
+,�  �*�   �  �B �� / � �       � �  �   $     *� *� � "�    �       �  � �  �   &     *� *� `� "�    �       �  � �  �   '     *Y� `� �    �   
    � 
 �  � �  �   '     *Y� `� �    �   
    � 
 �  � �  �   *     *� *� � #*� d�    �       �  � �  �   ,     *� *� `*� `� $�    �       � 	 � �  �  d     �*� *� % � &�'L*� ( N-� ) � �-� * � +M,� , � ,� , � 1,� - � (� Y� +� .� ,� / � 0� � L���,� 1 :� ) � C� * � 2:� /� Y� +� .� ,� / � 3� � 4� � L�����Z� Y� +� 4� � L+�    �   B   � 
 � �  �   �     Kz~�=	� 
dA`�=� 	0`�=*� 5W~�      && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.4'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $(document.body).height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);