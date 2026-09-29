---
id: funcion-inversa-y-composicion
titulo: Función inversa y composición
titulo_en: Inverse function and composition
alias:
  - composición de funciones
  - función compuesta
  - inversa
modulo: 0
submodulo: '0.1'
orden: 13
nivel: basico
prerrequisitos:
  - funciones-inyectivas-suprayectivas-y-biyectivas
etiquetas:
  - funciones
  - composición
  - inversa
  - biyección
resumen: >
  La composición g o f aplica primero f y luego g. Una función f tiene inversa, la que deshace su efecto,
  si y solo si es biyectiva; entonces f compuesta con su inversa es la identidad.
formula: '(g \circ f)(a) = g(f(a)),\qquad f^{-1} \circ f = \mathrm{id}_A,\quad f \circ f^{-1} = \mathrm{id}_B'
visualizacion:
  componente: FunctionMapping
  parametros:
    modo: composicion
    a: ['1', '2', '3', '4']
    b: ['a', 'b', 'c', 'd']
    c: ['x', 'y', 'z']
    f: [2, 0, 3, 1]
    g: [0, 1, 1, 2]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un paquete enviado por paquetería pasa por dos etapas: primero se asigna a un centro de distribución según su código postal y después, desde ese centro, a una ruta de reparto. Si se quiere saber directamente en qué ruta termina cada paquete, basta encadenar las dos asignaciones. Esa asignación encadenada es la composición: aplicar una función y, al resultado, aplicar otra.

La inversa responde la pregunta opuesta. Si un sistema cifra cada letra sustituyéndola por otra distinta, el destinatario necesita una regla que devuelva cada letra cifrada a la original. Esa regla solo existe si el cifrado nunca manda dos letras a la misma (de lo contrario no se sabría cuál era la original) y si cada letra cifrada proviene de alguna. Es decir, solo existe si el cifrado es una biyección.

## Definición

:::definicion[Composición]
Si $f: A \to B$ y $g: B \to C$, la **composición** $g \circ f: A \to C$ se define por $(g \circ f)(a) = g(f(a))$.
:::

Se lee "g compuesta con f" y se aplica de derecha a izquierda: primero $f$, después $g$. Requiere que el codominio de $f$ esté contenido en el dominio de $g$.

:::definicion[Función inversa]
La **identidad** en $A$ es $\mathrm{id}_A(a) = a$. Una función $f: A \to B$ es **invertible** si existe $f^{-1}: B \to A$ con
$$
f^{-1} \circ f = \mathrm{id}_A \quad \text{y} \quad f \circ f^{-1} = \mathrm{id}_B.
$$
:::

:::teorema
$f$ es invertible si y solo si es biyectiva. En ese caso, $f^{-1}(b)$ es la única preimagen de $b$, y la inversa es única.
:::

## Cómo usar la visualización

En la vista de composición aparecen tres columnas, $A$, $B$ y $C$, con las flechas de $f$ y de $g$. La reproducción sigue cada elemento de $A$: resalta su flecha por $f$, después la flecha de $g$ que sale del punto de llegada, y el panel registra $(g \circ f)(a)$. En la vista de inversa, las flechas de $f$ se invierten una por una, de $B$ hacia $A$.

Aquí $f$ es biyectiva, así que al invertirla cada elemento de $B$ recibe exactamente una flecha. En cambio, $g$ envía b y c al mismo elemento y, por eso, $g \circ f$ no es inyectiva: 1 y 4 terminan ambos en $y$.

## Ejemplo

En un laboratorio se convierte la temperatura de Celsius a Fahrenheit con $f(c) = \frac{9}{5}c + 32$, y después se calcula un índice de riesgo $g(t) = t - 90$ sobre la escala Fahrenheit.

1. **Composición.** $(g \circ f)(c) = \frac{9}{5}c + 32 - 90 = \frac{9}{5}c - 58$. Para $c = 35$: $f(35) = 95$ y $g(95) = 5$; con la fórmula compuesta, $\frac{9}{5} \cdot 35 - 58 = 5$.
2. **Orden.** $(f \circ g)(t) = \frac{9}{5}(t - 90) + 32$ es otra función: para $t = 95$ da $41$, no $5$.
3. **Inversa.** $f$ es biyectiva de $\mathbb{R}$ en $\mathbb{R}$. Despejando $t = \frac{9}{5}c + 32$ se obtiene $f^{-1}(t) = \frac{5}{9}(t - 32)$. Comprobación: $f^{-1}(95) = \frac{5}{9} \cdot 63 = 35$.

## Propiedades

- **Asociatividad:** $h \circ (g \circ f) = (h \circ g) \circ f$.
- **No conmutatividad:** en general $g \circ f \neq f \circ g$, e incluso una de ellas puede no estar definida.
- **Identidad:** $f \circ \mathrm{id}_A = f = \mathrm{id}_B \circ f$.
- **Inversa de una composición:** $(g \circ f)^{-1} = f^{-1} \circ g^{-1}$, con el orden invertido.
- $(f^{-1})^{-1} = f$.
- Si $g \circ f$ es inyectiva, $f$ es inyectiva; si $g \circ f$ es suprayectiva, $g$ es suprayectiva.
- La gráfica de $f^{-1}$ en el plano es la reflexión de la gráfica de $f$ respecto de la recta $y = x$.

:::demostracion
Para $(g \circ f)^{-1} = f^{-1} \circ g^{-1}$, basta comprobar que funciona como inversa: $(f^{-1} \circ g^{-1}) \circ (g \circ f) = f^{-1} \circ (g^{-1} \circ g) \circ f = f^{-1} \circ f = \mathrm{id}_A$, y del mismo modo en el otro orden. Por la unicidad de la inversa, es la inversa.
:::

## Errores comunes

- **Aplicar la composición de izquierda a derecha.** En $g \circ f$ se aplica primero $f$.
- **Confundir $f^{-1}(x)$ con $1/f(x)$.** La inversa deshace la función; el recíproco divide.
- **Buscar la inversa de una función no biyectiva.** $x \mapsto x^2$ sobre $\mathbb{R}$ no tiene inversa; la raíz cuadrada es inversa solo si se restringe el dominio a $[0, \infty)$.
- **Invertir una composición sin cambiar el orden.** Para deshacer "ponerse calcetines y luego zapatos" hay que quitar primero los zapatos.

## Conexiones

La existencia de inversa depende de la clasificación de [[funciones-inyectivas-suprayectivas-y-biyectivas]]. Las biyecciones y sus inversas permiten comparar tamaños en [[cardinalidad-finita-numerable-y-no-numerable]]. La composición aparece en todo el Atlas: la regla de la cadena del cálculo, la función cuantil como inversa de la función de distribución y las redes neuronales como composición de capas.
