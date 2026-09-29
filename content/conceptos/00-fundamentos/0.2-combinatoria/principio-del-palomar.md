---
id: principio-del-palomar
titulo: Principio del palomar
titulo_en: Pigeonhole principle
alias:
  - principio de las casillas
  - principio de Dirichlet
modulo: 0
submodulo: '0.2'
orden: 16
nivel: basico
prerrequisitos:
  - funciones-inyectivas-suprayectivas-y-biyectivas
etiquetas:
  - conteo
  - existencia
  - funciones
  - cotas
resumen: >
  Si se reparten n objetos en m cajas y n > m, alguna caja recibe al menos dos objetos; en general,
  alguna recibe al menos el techo de n/m. Garantiza que algo existe sin decir dónde.
formula: 'n > m \;\Rightarrow\; \exists\, \text{caja con al menos } \left\lceil n/m \right\rceil \text{ objetos}'
visualizacion:
  componente: PigeonholeViz
  parametros:
    objetos: 11
    cajas: 10
    estrategia: repartir
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En un grupo de 13 personas, al menos dos nacieron en el mismo mes. No hace falta preguntar a nadie: hay 12 meses y 13 personas, así que por más que se intente repartirlas en meses distintos, la persona número 13 tiene que caer en un mes ya ocupado. Si hay 11 palomas y 10 casillas, alguna casilla aloja al menos dos palomas.

Este principio parece obvio, pero es sorprendentemente poderoso porque garantiza la existencia de algo sin construirlo. Dice que existen dos personas con el mismo mes de nacimiento, pero no cuáles. La versión general es igual de sencilla: si se reparten $n$ objetos en $m$ cajas, alguna caja recibe al menos $\lceil n/m \rceil$ objetos, porque si todas tuvieran menos, el total no alcanzaría $n$.

El arte de usarlo está en decidir qué son las palomas y qué son las casillas en cada problema.

## Definición

:::teorema[Principio del palomar]
Sea $f: A \to B$ una función entre conjuntos finitos.

1. Si $|A| > |B|$, entonces $f$ no es inyectiva: existen $a_1 \neq a_2$ con $f(a_1) = f(a_2)$.
2. Más generalmente, existe $b \in B$ con $|f^{-1}(\{b\})| \ge \left\lceil \frac{|A|}{|B|} \right\rceil$.
:::

:::demostracion
Si cada $b$ tuviera a lo más $\lceil |A|/|B| \rceil - 1$ preimágenes, entonces $|A| = \sum_{b \in B} |f^{-1}(\{b\})| \le |B|\left(\lceil |A|/|B| \rceil - 1\right) < |B| \cdot \frac{|A|}{|B|} = |A|$, una contradicción. La desigualdad estricta usa que $\lceil x \rceil - 1 < x$.
:::

## Cómo usar la visualización

Cada columna es una caja y los objetos caen uno por uno; los que llegan a una caja ya ocupada se pintan de otro color. La línea discontinua marca el nivel $\lceil n/m \rceil$ que el principio garantiza. Con "Lo más parejo posible" los objetos se reparten de la forma que más retrasa las repeticiones; con "Al azar" cada objeto elige caja con la semilla.

Con 11 objetos y 10 cajas, incluso el reparto más parejo deja una caja con dos. Con 10 objetos y 10 cajas el reparto parejo no repite, pero el reparto al azar casi siempre lo hace: el principio da una garantía para el peor caso, y en la práctica las repeticiones aparecen mucho antes.

## Ejemplo

Un estacionamiento registra las placas de 1000 autos y las clasifica según sus dos últimos dígitos.

1. Hay 100 terminaciones posibles, de 00 a 99: son las casillas. Los 1000 autos son las palomas.
2. Por el principio general, alguna terminación la comparten al menos $\lceil 1000/100 \rceil = 10$ autos.
3. Si se quiere garantizar que al menos 3 autos compartan terminación, basta tener $2 \cdot 100 + 1 = 201$ autos: con 200 podría haber exactamente 2 por terminación.

:::figura[Una versión reducida del ejemplo: 21 autos clasificados por su último dígito, 10 casillas. Aun repartiendo lo más parejo posible, alguna terminación la comparten 3 autos, porque $\lceil 21/10 \rceil = 3$.]{componente="PigeonholeViz"}
```yaml
objetos: 21
cajas: 10
estrategia: repartir
```
:::

:::figura[Con un reparto al azar las repeticiones llegan mucho antes de lo que el principio garantiza: con solo 6 objetos y 10 cajas, lo más común es que dos compartan caja.]{componente="PigeonholeViz"}
```yaml
objetos: 6
cajas: 10
estrategia: azar
```
:::

## Propiedades

- **Forma fuerte:** si $n = q_1 + \dots + q_m - m + 1$ objetos se reparten en $m$ cajas, alguna caja $i$ recibe al menos $q_i$ objetos.
- **Promedio:** en cualquier lista de números, alguno es mayor o igual que el promedio y alguno es menor o igual.
- **Versión infinita:** si infinitos objetos se reparten en un número finito de cajas, alguna caja recibe infinitos.
- **Número mínimo:** para garantizar $k$ objetos en una misma caja con $m$ cajas se necesitan $(k-1)m + 1$ objetos.
- **Aplicaciones:** existencia de repeticiones en funciones hash, de subsucesiones monótonas (teorema de Erdős y Szekeres) y de aproximaciones racionales (teorema de Dirichlet).

## Errores comunes

- **Pensar que el principio dice cuál caja.** Solo garantiza que existe; no la identifica.
- **Usarlo con $n \le m$.** Con tantos objetos como cajas, es posible que no haya repeticiones.
- **Olvidar el techo.** Con 25 objetos y 12 cajas, alguna tiene al menos $\lceil 25/12 \rceil = 3$, no 2.
- **Confundir garantía con probabilidad.** Con 23 personas no está garantizado que dos compartan cumpleaños, pero la probabilidad supera 1/2.

## Conexiones

El principio es la afirmación de que no existen [[funciones-inyectivas-suprayectivas-y-biyectivas|funciones inyectivas]] de un conjunto finito a otro más pequeño, y su demostración es un argumento de conteo con el [[principio-de-la-suma]]. Se usa como herramienta de existencia en combinatoria, teoría de números y computación. En probabilidad, la paradoja del cumpleaños estudia con qué probabilidad aparecen repeticiones antes de que el principio las garantice.
