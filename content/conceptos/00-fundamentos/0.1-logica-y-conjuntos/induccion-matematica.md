---
id: induccion-matematica
titulo: Inducción matemática
titulo_en: Mathematical induction
alias:
  - principio de inducción
  - demostración por inducción
  - inducción fuerte
modulo: 0
submodulo: '0.1'
orden: 21
nivel: basico
prerrequisitos:
  - sucesiones
etiquetas:
  - demostración
  - inducción
  - números naturales
  - lógica
resumen: >
  Para demostrar que P(n) vale para todo natural n basta probar el caso base P(1) y que P(k) implica
  P(k + 1). Juntos garantizan la propiedad para cada n, como una fila de fichas de dominó que caen.
formula: '\big[P(1) \land \forall k\,(P(k) \Rightarrow P(k+1))\big] \Rightarrow \forall n\ P(n)'
visualizacion:
  componente: InductionViz
  parametros:
    vista: fichas
    n: 10
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una fila de fichas de dominó está parada de modo que cada ficha, al caer, derriba a la siguiente. Para asegurar que todas caerán hacen falta dos cosas: que alguien empuje la primera y que la separación entre fichas sea la adecuada en toda la fila. Si nadie empuja la primera, ninguna cae aunque la fila esté perfectamente acomodada. Si en algún punto hay un hueco demasiado grande, la caída se detiene ahí aunque la primera haya caído.

La inducción matemática es esta idea aplicada a afirmaciones sobre los números naturales. El caso base empuja la primera ficha: se comprueba que la afirmación vale para $n = 1$. El paso inductivo garantiza que no hay huecos: se demuestra que, si la afirmación vale para un $k$ cualquiera, también vale para $k + 1$. Con esas dos piezas, la afirmación vale para 1, luego para 2, luego para 3, y así para cualquier natural, sin tener que revisarlos uno por uno.

## Definición

:::teorema[Principio de inducción]
Sea $P(n)$ un predicado sobre los naturales. Si

1. **caso base:** $P(1)$ es verdadera, y
2. **paso inductivo:** para todo $k \ge 1$, $P(k)$ implica $P(k + 1)$,

entonces $P(n)$ es verdadera para todo $n \in \mathbb{N}$.
:::

En el paso inductivo, la suposición $P(k)$ se llama **hipótesis de inducción**. El caso base puede empezar en cualquier entero $n_0$, y entonces la conclusión vale para todo $n \ge n_0$.

**Inducción fuerte:** si $P(1)$ vale y, para todo $k$, $P(1) \land \dots \land P(k)$ implica $P(k + 1)$, entonces $P(n)$ vale para todo $n$. Es equivalente a la inducción usual.

## Cómo usar la visualización

La vista "Base y paso" muestra una fila de $n$ fichas. El interruptor del caso base decide si la primera ficha recibe el empujón, y el control "El paso falla en k" crea un hueco entre la ficha $k$ y la $k + 1$. El panel indica cuántas fichas cayeron. La vista "Suma 1 + 2 + ... + n" construye una escalera de bloques, columna por columna, y la completa con una copia girada hasta formar un rectángulo de $n$ por $n + 1$.

Al desactivar el caso base no cae ninguna ficha, aunque el paso se cumpla en toda la fila. Con el caso base activo y el paso fallando en $k = 4$, caen exactamente las primeras 4. Solo con ambas condiciones caen todas.

## Ejemplo

Se demuestra que $\sum_{i=1}^{n} (2i - 1) = n^2$, es decir, que la suma de los primeros $n$ impares es un cuadrado.

1. **Caso base.** Para $n = 1$: $\sum_{i=1}^{1} (2i - 1) = 1 = 1^2$.
2. **Hipótesis de inducción.** Supongamos que $\sum_{i=1}^{k} (2i - 1) = k^2$ para cierto $k \ge 1$.
3. **Paso inductivo.** Entonces
$$
\sum_{i=1}^{k+1} (2i - 1) = \sum_{i=1}^{k} (2i - 1) + (2k + 1) = k^2 + 2k + 1 = (k + 1)^2.
$$
4. **Conclusión.** Por el principio de inducción, la igualdad vale para todo $n \ge 1$. Por ejemplo, con $n = 6$: $1 + 3 + 5 + 7 + 9 + 11 = 36$.

## Propiedades

- La inducción es equivalente al **principio del buen orden**: todo subconjunto no vacío de $\mathbb{N}$ tiene un elemento mínimo.
- La inducción fuerte y la usual demuestran exactamente los mismos resultados.
- Sirve para demostrar identidades ($\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$), desigualdades ($2^n > n$), propiedades de divisibilidad ($3 \mid n^3 - n$) y la corrección de algoritmos recursivos.
- Las definiciones recursivas, como $0! = 1$ y $(n + 1)! = (n + 1)\,n!$, se analizan naturalmente por inducción.

:::demostracion
Supongamos que se cumplen la base y el paso, pero que el conjunto $F = \{n : P(n) \text{ es falsa}\}$ no es vacío. Por el buen orden tiene un mínimo $m$. No puede ser $m = 1$, por el caso base; entonces $m - 1 \ge 1$ y $P(m - 1)$ es verdadera por la minimalidad de $m$. El paso inductivo da $P(m)$ verdadera, una contradicción.
:::

## Errores comunes

- **Omitir el caso base.** "Si $n^2 + n$ es impar, $(n+1)^2 + (n+1)$ también lo es" es un paso válido, pero la afirmación es falsa para todo $n$ porque no hay base.
- **Suponer lo que se quiere demostrar.** La hipótesis es $P(k)$ para un $k$ fijo, no $P(n)$ para todo $n$.
- **Un paso que no funciona para el primer $k$.** El argumento clásico de que "todos los caballos son del mismo color" falla al pasar de $k = 1$ a $k = 2$.
- **Verificar muchos casos en lugar de demostrar el paso.** Revisar $n = 1, \dots, 100$ no sustituye al paso inductivo.

## Conexiones

La inducción es la herramienta para demostrar afirmaciones con el cuantificador universal de [[cuantificadores-universal-y-existencial]] sobre los naturales, y se aplica de manera natural a [[sucesiones]] definidas recursivamente. Las fórmulas cerradas de la [[notacion-sumatoria-y-productoria]] y la suma parcial de la [[serie-geometrica]] se demuestran así. En probabilidad y en algoritmos, la inducción justifica fórmulas recursivas y la corrección de procedimientos iterativos.
