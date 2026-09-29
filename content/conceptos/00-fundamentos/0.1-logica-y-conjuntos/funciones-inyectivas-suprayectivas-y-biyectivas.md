---
id: funciones-inyectivas-suprayectivas-y-biyectivas
titulo: Funciones inyectivas, suprayectivas y biyectivas
titulo_en: Injective, surjective and bijective functions
alias:
  - inyectiva
  - suprayectiva
  - sobreyectiva
  - biyectiva
  - biyección
  - uno a uno
modulo: 0
submodulo: '0.1'
orden: 12
nivel: basico
prerrequisitos:
  - funciones
etiquetas:
  - funciones
  - inyectividad
  - suprayectividad
  - biyección
  - conteo
resumen: >
  Una función es inyectiva si elementos distintos tienen imágenes distintas, suprayectiva si alcanza todo
  el codominio y biyectiva si cumple ambas cosas, emparejando uno a uno los dos conjuntos.
formula: 'f(a_1) = f(a_2) \Rightarrow a_1 = a_2,\qquad \forall b\ \exists a:\ f(a) = b'
visualizacion:
  componente: FunctionMapping
  parametros:
    modo: clasificacion
    ejemplos:
      - nombre: Casilleros asignados
        dominio: ['Luis', 'Marta', 'Nico', 'Olga']
        codominio: ['1', '2', '3', '4', '5']
        flechas: [[0, 2], [1, 0], [2, 4], [3, 1]]
      - nombre: Turnos de guardia
        dominio: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']
        codominio: ['Pau', 'Rita', 'Saúl']
        flechas: [[0, 0], [1, 1], [2, 2], [3, 0], [4, 1]]
      - nombre: Asientos numerados
        dominio: ['A', 'B', 'C', 'D']
        codominio: ['1', '2', '3', '4']
        flechas: [[0, 3], [1, 1], [2, 0], [3, 2]]
      - nombre: Ninguna de las dos
        dominio: ['p', 'q', 'r', 's']
        codominio: ['1', '2', '3', '4']
        flechas: [[0, 0], [1, 0], [2, 2], [3, 3]]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En un gimnasio, cada socio recibe un casillero. Si dos socios compartieran casillero habría conflictos, así que la asignación debe ser inyectiva: socios distintos, casilleros distintos. Puede sobrar algún casillero vacío.

En un hospital, cada día de la semana tiene un médico de guardia, y la dirección quiere que todos los médicos cubran al menos un turno. Esa asignación debe ser suprayectiva: ningún médico queda sin turno, aunque alguno cubra varios días.

En un teatro con asientos numerados y boletos vendidos para todos los lugares, cada espectador tiene su asiento y cada asiento su espectador. Esa correspondencia perfecta es una biyección, y es la que permite afirmar, sin contar a nadie, que hay tantos espectadores como asientos. Contar elementos consiste, en el fondo, en construir una biyección con $\{1, \dots, n\}$.

## Definición

Sea $f: A \to B$.

:::definicion[Tipos de funciones]
- $f$ es **inyectiva** si $f(a_1) = f(a_2)$ implica $a_1 = a_2$; equivalentemente, cada $b \in B$ tiene a lo más una preimagen.
- $f$ es **suprayectiva** si $f(A) = B$, es decir, $\forall b \in B\ \exists a \in A:\ f(a) = b$.
- $f$ es **biyectiva** si es inyectiva y suprayectiva: cada $b \in B$ tiene exactamente una preimagen.
:::

Para demostrar inyectividad se supone $f(a_1) = f(a_2)$ y se deduce $a_1 = a_2$. Para refutarla basta un par $a_1 \neq a_2$ con la misma imagen. Para refutar la suprayectividad basta un $b$ sin preimagen.

## Cómo usar la visualización

Cada ejemplo muestra una función con flechas del dominio al codominio. Al terminar la reproducción el panel responde si es inyectiva, suprayectiva y biyectiva, e identifica la causa cuando no lo es: los elementos que comparten imagen se marcan en naranja y los elementos del codominio sin preimagen en ámbar. Un clic en un elemento del dominio y luego en uno del codominio mueve su flecha, de modo que el diagrama siempre sigue siendo función.

En "Ninguna de las dos", mover la flecha de q hacia 2 vuelve biyectiva la función. En "Casilleros asignados" ninguna edición la hace suprayectiva: con 4 socios y 5 casilleros siempre sobra uno.

## Ejemplo

Se analizan tres funciones sobre los enteros.

1. $f: \mathbb{Z} \to \mathbb{Z}$, $f(n) = 2n + 1$. Si $2n_1 + 1 = 2n_2 + 1$, entonces $n_1 = n_2$: es inyectiva. No es suprayectiva, porque $4$ no es de la forma $2n + 1$ con $n$ entero.
2. $g: \mathbb{Z} \to \{0, 1, 2\}$, $g(n) = $ residuo de $n$ entre 3. Es suprayectiva, pues $g(0) = 0$, $g(1) = 1$ y $g(2) = 2$; no es inyectiva, pues $g(0) = g(3)$.
3. $h: \mathbb{Z} \to \mathbb{Z}$, $h(n) = n + 5$. Es inyectiva por el mismo argumento que $f$, y es suprayectiva porque cada $m$ es $h(m - 5)$. Por tanto es biyectiva.

## Propiedades

Para $A$ y $B$ finitos:

- Si $f$ es inyectiva, $|A| \le |B|$.
- Si $f$ es suprayectiva, $|A| \ge |B|$.
- Si $f$ es biyectiva, $|A| = |B|$.
- Si $|A| = |B|$, $f$ es inyectiva si y solo si es suprayectiva.
- **Principio del palomar:** si $|A| > |B|$, ninguna función de $A$ en $B$ es inyectiva.

Además, la composición de inyectivas es inyectiva y la de suprayectivas es suprayectiva, y $f$ tiene inversa si y solo si es biyectiva.

:::demostracion
Si $f$ es inyectiva, los $|A|$ elementos tienen imágenes distintas, así que $f(A)$ tiene $|A|$ elementos y está contenido en $B$; por tanto $|A| \le |B|$. Si además $|A| = |B|$, entonces $f(A)$ es un subconjunto de $B$ con tantos elementos como $B$, y por ser finito coincide con $B$.
:::

## Errores comunes

- **Confundir inyectiva con "ser función".** Ser función prohíbe que una entrada tenga dos salidas; ser inyectiva prohíbe que dos entradas compartan salida.
- **Olvidar el codominio al hablar de suprayectividad.** $x \mapsto x^2$ es suprayectiva sobre $[0, \infty)$ y no lo es sobre $\mathbb{R}$.
- **Comprobar la inyectividad con unos cuantos valores.** Se necesita un argumento para todo par; un solo par que choca basta para negarla.
- **Aplicar "inyectiva si y solo si suprayectiva" a conjuntos infinitos.** $n \mapsto 2n$ es inyectiva de $\mathbb{N}$ en $\mathbb{N}$ y no es suprayectiva.

## Conexiones

Estas propiedades refinan la definición de [[funciones]]. Las biyecciones son exactamente las funciones con inversa, tema de [[funcion-inversa-y-composicion]], y son la herramienta para comparar tamaños de conjuntos en [[cardinalidad-finita-numerable-y-no-numerable]]. En combinatoria, el principio del palomar y el conteo por biyecciones se apoyan directamente en ellas.
