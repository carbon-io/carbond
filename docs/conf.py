# -*- coding: utf-8 -*-

import os
import sys
import sphinx_rtd_theme

# -- General configuration ------------------------------------------------

extensions = [
    'sphinx.ext.intersphinx',
    'sphinx.ext.ifconfig',
]
templates_path = ['_templates']
source_suffix = '.rst'
master_doc = 'index'
project = u'carbond'
copyright = u'2016, Will Shulman, Greg Banks'
author = u'Will Shulman, Greg Banks'
version = u'0.2.8'
release = u'0.2.8'
language = None
exclude_patterns = ['_build']
pygments_style = 'sphinx'
todo_include_todos = False

# -- Options for HTML output ----------------------------------------------

html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    'collapse_navigation': False,
    'navigation_depth': 3
}
html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]
html_static_path = ['_static']
htmlhelp_basename = 'carbonddoc'

# -- Options for LaTeX output ---------------------------------------------

latex_elements = { }
latex_documents = [
    (master_doc, 'carbond.tex', u'carbond Documentation',
     u'Will Shulman, Greg Banks', 'manual'),
]

# -- Options for manual page output ---------------------------------------

man_pages = [
    (master_doc, 'carbond', u'carbond Documentation',
     [author], 1)
]

# -- Options for Texinfo output -------------------------------------------

texinfo_documents = [
    (master_doc, 'carbond', u'carbond Documentation',
     author, 'carbond', 'One line description of project.',
     'Miscellaneous'),
]

# -- Options for Epub output ----------------------------------------------

epub_title = project
epub_author = author
epub_publisher = author
epub_copyright = copyright
epub_exclude_files = ['search.html']
intersphinx_mapping = {
    'sphinx': ('http://www.sphinx-doc.org/en/stable/', None),
}

on_rtd = os.environ.get('READTHEDOCS') == 'True'
if on_rtd:
    environment = 'prod'
else:
    environment = 'dev'

html_context = {
    'local_rtd_menu': True,
}

def setup(app):
    app.add_stylesheet('style.css')
    app.add_javascript('carbon.js')
    app.add_config_value('environment', '', 'env')
