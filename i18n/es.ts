const es = {
  // Note: anything appended with '*' means I'm not sure of the translation
  common: {
    welcome: `¡Bienvenidos!`,
    alreadyHaveAccount: `¿Ya tienes una cuenta?`,
    dontHaveAccount: `¿No tienes una cuenta?`,
    loginText: `Inicia Sesión`,
    forgotPassword: `¿Has olvidado tu contraseña?`,
    appName: `Strands`,
    public: 'Público',

    endOfList: `¡No hay nada mas!`,
    fieldsMissing: 'Todos los campos son obligatorios y no pueden estar vacíos', // *
    deleteTitle: 'Borrar', // *
    cancel: 'Cancelar',
    confirmDelete: `Si, borralo`,
    confirmLogout: '¿Estás seguro que quieres cerrar la sessión?',
    areYouSure: '¿Estás seguro?',
    nameInputPlaceholder: 'Añadir nombre',
    emailInputPlaceholder: 'Añadir correo eléctronico',
    passwordInputPlaceholder: 'Añadir contraseña',
    phoneInputPlaceholder: 'Añadir número de teléfono',
    addressInputPlaceholder: 'Añadir dirección',
    bioInputPlaceholder: 'Añadir bio',

    update: 'Actualizar',
    post: 'Post',
    clientName: 'Nombre de cliente',
    allCaughtUp: '¡Te pusiste al día!',
    comment: 'Comment',
    confirm: 'Confirmar',
    login: 'Iniciar Sesión',
    logout: 'Cerrar sesión',
    signUp: 'Registrate',
    signOut: 'Cerrar sesión',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    postActionButton: 'Publicar',
  },
  errors: {
    signOut: 'Error signing out',
  },

  // Screen-specific
  welcomeScreen: {
    title: `¡Bienvenidos!`,
    missionStatement: `Queremos darte un lugar para compartir detalles sobre tus clientes, como a qué responde mejor su cabello y cualquier éxito o dificultad que hayas podido tener con ellos!`,
    gettingStarted: 'Empezamos', // *
  },
  signUpScreen: {
    title: `Registrate`,
    alerts: {
      fieldsMissing: `Please fill all the fields in order to create your account`,
    },
    getStarted: 'Empezamos',
    formPrompt: `Por favor añades todos los detalles a crear tu cuenta`,
  },
  loginScreen: {
    title: `Iniciar Sesión`,
    fieldsMissing: `Fields missing!`,
    welcomeBack1: `¡Ciao!`,
    welcomeBack2: `Bienvenido de vuelta`,
    pleaseLogin: `Por favor inicas la sesión a continuar`,
  },
  homeScreen: {
    clientName: 'Cliente',
  },
  editProfileScreen: {
    title: 'Editar Perfil',
    formPrompt: 'Por favor añades los detalles de tu cuenta',
    deleteAccountButtonTitle: 'Borrar cuenta',
    deletePromptTitle: '¿Borrar cuenta?',
    deletePromptDescription: `Once you delete your account, your profile and username are permanently removed from Pelli and your posts and comments are disassociated (will show up as 'deleted user') from your account`,
    deleteAccountFinal: `This action will completely remove your account. Enter the text below to proceed (case-sensitive!)`,
  },
  newPostScreen: {
    chooseSomeMedia: 'Arrastrar y soltar o subir contenido multimedia', // *
    formulaTypePlaceholder: 'Tipo (e.g. AVEDA, Tramesi, ...)',
    formulaDescriptionPlaceholder: 'Descripción (e.g. 20g Bronze + 40 AU)',
    addToPost: 'Añadir al posteo',
    title: 'Crea un posteo',
    postBodyPlaceholder:
      '¿Cuáles son lost detalles del cliente que deseas compartir?', // *
  },
  postDetailsSreen: {
    noPosts: '¡No hay un posteo acá!',
    commentInputPlaceholder: 'Añadir un commentario...',
    noCommentsYet: 'Seas el primer commentario',
  },
  profileScreen: {
    myRecentPosts: 'Mis posteos recientes:',
  },
  forgotPasswordScreen: {
    title: 'Reajustas la contraseña', // *
    sendReset: 'Enviar', // *
    newPasswordPrompt: '¿Como es tu contraseña nueva?',
    passwordUpdateSuccess: '¡Contraseña reajustado!', // *
    passwordUpdateError: 'Habia un error de reajustar tu contraseña', // *
    alerts: {
      emailMissing: 'Dirección de correo no puede ser vacío!',
    },
  },

  errorScreen: {},
  emptyStateComponent: {
    generic: {},
  },
};

export default es;
export type Translations = typeof es;
