from django import template

register = template.Library()


@register.simple_tag
def livereload():
    return ""


@register.simple_tag
def livereload_script():
    return ""
