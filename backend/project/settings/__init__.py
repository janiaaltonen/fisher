from split_settings.tools import include, optional

include(
    # load environment settings
    'base/env.py',
    optional('local/env.py'),

    # order matters because of dependencies
    'base/paths.py',
    'base/apps.py',
    'base/middleware.py',
    # 'base/debug_toolbar.py',

    # Load all other settings
    'base/*.py',

    optional('local/*.py'),  # load any other settings from local folder
)
