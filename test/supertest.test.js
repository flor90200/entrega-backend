import { expect } from 'chai'
import supertest from 'supertest'


const requester = supertest('http://localhost:8080')




describe('Testing', () => {
 
    let cookie;
    const mockUser = {
        email: 'flor90200@gmail.com',
        password: 'secret'
    }

    describe('Test de Session', () => {
        
        it('El endpoint POST /session/login debería iniciar sesión con un usuario', async () => {

            const result = await requester.post('/session/login')
            .send({ Email: mockUser.email,  Password: mockUser.password })
             

            const cookieResult = result.headers['set-cookie'][0];
            expect(cookieResult).to.be.ok
        
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]  
        }
           
            expect(cookie.name).to.be.ok.and.equal('connect.sid')
            expect(cookie.value).to.be.ok
           
           
        });
   

    it('El endpoint GET /api/products debería obtener productos después del inicio de sesión', async () => {
      
            const { body } = await requester.get('/api/products').set('cookie', [`${cookie.name}=${cookie.value}`]);

            console.log('body products:', body);
            expect(body.status).to.eql('success');

            // Verifica que haya al menos un producto en el payload
            expect(body.payload).to.be.an('array').that.is.not.empty;
    });


    it('El usuario debería ver los productos en su carrito /carts', async () => {
        const { body } = await requester.get('/carts').set('cookie', [`${cookie.name}=${cookie.value}`]);
    
        console.log('body carts:', body);
    
        // Verifica que body es un objeto
        expect(body).to.be.an('object');
    
        // Verifica que body no tenga propiedades específicas
        expect(body).to.not.have.any.keys('propiedad1', 'propiedad2', /* ...agrega más propiedades si es necesario */);
    });
  
})
});