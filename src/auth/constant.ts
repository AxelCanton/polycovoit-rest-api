//----- A changer en mettant la clé secrète dans les variables d'environnement -------

export const jwtConstants = {
    secret: 'secretKey',
    expiredTokenErrorMessage: 'Token expired',
    malformedTokenErrorMessage:'Malformed token'
  };