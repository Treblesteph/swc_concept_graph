#============================================================
# Controls
#============================================================

#----------------------------------------
# Settings
#----------------------------------------

MAKEFILES=Makefile $(wildcard *.mk)
DOT=dot
JEKYLL=jekyll

#----------------------------------------
# Comands
#----------------------------------------

all : commands

## commands   : show all commands.
commands :
	@grep -h -E '^##' ${MAKEFILES} | sed -e 's/## //g'

## serve      : run a local server.
serve :
	${JEKYLL} serve --config _config.yml

## site       : build files but do not run a server.
site :
	${JEKYLL} build --config _config.yml

## graphical  : build dependency diagram.
graphical :
	${DOT} -Tsvg design.gv > design.svg

## clean      : clean up junk files.
clean :
	@rm -rf _site
	@rm -rf .sass-cache
	@find . -name .DS_Store -exec rm {} \;
	@find . -name '*~' -exec rm {} \;
	@find . -name '*.pyc' -exec rm {} \;
