---
id: permutaciones-con-repeticion
titulo: Permutaciones con repetición (anagramas)
titulo_en: Permutations of a multiset
alias:
  - anagramas
  - permutaciones de un multiconjunto
  - permutaciones con elementos repetidos
modulo: 0
submodulo: '0.2'
orden: 5
nivel: basico
prerrequisitos:
  - permutaciones
etiquetas:
  - conteo
  - anagramas
  - multiconjuntos
  - clases de equivalencia
resumen: >
  Si entre n objetos hay grupos de objetos idénticos de tamaños k1, ..., kr, el número de ordenamientos
  distintos es n! dividido entre k1! ... kr!, porque intercambiar objetos idénticos no produce un orden nuevo.
formula: '\frac{n!}{k_1!\,k_2!\cdots k_r!},\qquad k_1 + \dots + k_r = n'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: anagramas
    palabra: PAPAYA
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

¿Cuántas palabras distintas, tengan o no sentido, se forman reordenando las letras de PAPAYA? Si las seis letras fueran distintas habría $6! = 720$ órdenes. Pero hay tres A y dos P, y cambiar de lugar dos A entre sí no produce una palabra nueva.

Un truco útil es distinguir primero las copias con subíndices: $P_1 A_1 P_2 A_2 Y A_3$. Con las letras marcadas sí hay 720 ordenaciones. Después se borran los subíndices. Cada palabra sin marcas, como APAPYA, proviene de varias ordenaciones marcadas: las que difieren solo en cómo se reparten los subíndices de las A (3! maneras) y de las P (2! maneras). Así, cada palabra aparece exactamente $3! \cdot 2! = 12$ veces entre las 720, y hay $720 / 12 = 60$ palabras distintas.

La idea general es contar de más y después dividir entre el número de veces que se contó cada objeto, lo que solo es válido cuando todos los grupos tienen el mismo tamaño.

## Definición

Sea un multiconjunto con $r$ tipos de objetos, $k_i$ copias idénticas del tipo $i$ y $n = k_1 + \dots + k_r$ objetos en total.

:::teorema[Permutaciones con repetición]
El número de sucesiones distintas de longitud $n$ que usan exactamente $k_i$ objetos del tipo $i$ es
$$
\frac{n!}{k_1!\,k_2!\cdots k_r!}.
$$
:::

:::demostracion
Al distinguir las copias hay $n!$ ordenaciones. La relación "difieren solo en los subíndices" es de equivalencia, y cada clase contiene exactamente $k_1! \cdots k_r!$ ordenaciones, una por cada forma de permutar las copias de cada tipo entre sí. Por el principio de la suma, $n!$ es el número de clases multiplicado por ese tamaño común.
:::

## Cómo usar la visualización

Arriba se ve la ordenación actual con las copias numeradas. La reproducción recorre las 720 ordenaciones de las letras marcadas y deposita cada una en la tarjeta de la palabra que produce al borrar los números. Cada tarjeta tiene un medidor con tantas celdas como copias le corresponden.

Al terminar, todas las tarjetas tienen su medidor lleno con 12 celdas: el conteo de 720 se reparte en 60 grupos iguales. Al activar "Distinguir las letras repetidas", cada ordenación es su propia clase y el número de palabras sube a $6! = 720$.

## Ejemplo

Un laboratorio registra una secuencia de 10 ensayos con resultado éxito (E), fracaso (F) o nulo (N), y quiere saber cuántas secuencias tienen exactamente 5 éxitos, 3 fracasos y 2 nulos.

1. Se trata de ordenar el multiconjunto $\{E^5, F^3, N^2\}$ con $n = 10$.
2. Por la fórmula: $\frac{10!}{5!\,3!\,2!} = \frac{3628800}{120 \cdot 6 \cdot 2} = \frac{3628800}{1440} = 2520$.
3. Otra forma: se eligen las posiciones de los éxitos, $\binom{10}{5} = 252$, luego las de los fracasos entre las 5 restantes, $\binom{5}{3} = 10$, y los nulos ocupan lo que queda: $252 \cdot 10 = 2520$.

:::figura[Una versión reducida del ejemplo: 3 éxitos, 2 fracasos y 1 nulo en 6 ensayos. Con los resultados iguales numerados hay $6! = 720$ secuencias; al borrar los números se agrupan de 12 en 12 y quedan $720 / (3! \cdot 2!) = 60$ secuencias distintas.]{componente="CombinatoricsBoard"}
```yaml
modo: anagramas
palabra: EEEFFN
```
:::

:::figura[El conteo completo del ejemplo por dos caminos. Elegir las posiciones de los éxitos, luego las de los fracasos, y dejar los nulos en lo que resta da $252 \cdot 10 \cdot 1$; ordenar las 10 marcas y dividir entre $5! \cdot 3! \cdot 2! = 1440$ da el mismo 2520.]{componente="CombinatoricsBoard"}
```yaml
modo: casillas
escenarios:
  - nombre: Elegir posiciones
    casillas:
      - etiqueta: lugares de E
        opciones: 252
      - etiqueta: lugares de F
        opciones: 10
      - etiqueta: lugares de N
        opciones: 1
  - nombre: Ordenar y dividir
    casillas:
      - etiqueta: '1'
        opciones: 10
      - etiqueta: '2'
        opciones: 9
      - etiqueta: '3'
        opciones: 8
      - etiqueta: '4'
        opciones: 7
      - etiqueta: '5'
        opciones: 6
      - etiqueta: '6'
        opciones: 5
      - etiqueta: '7'
        opciones: 4
      - etiqueta: '8'
        opciones: 3
      - etiqueta: '9'
        opciones: 2
      - etiqueta: '10'
        opciones: 1
    divisor:
      valor: 1440
      texto: "5! · 3! · 2! órdenes entre iguales"
```
:::

## Propiedades

- **Dos tipos:** con $k$ objetos de un tipo y $n - k$ de otro, la fórmula da $\frac{n!}{k!(n-k)!} = \binom{n}{k}$, el coeficiente binomial.
- **Elección por etapas:** $\frac{n!}{k_1!\cdots k_r!} = \binom{n}{k_1}\binom{n - k_1}{k_2}\cdots\binom{k_r}{k_r}$.
- **Coeficiente multinomial:** la misma cantidad es el coeficiente de $x_1^{k_1}\cdots x_r^{k_r}$ en $(x_1 + \dots + x_r)^n$.
- Si todos los $k_i$ valen 1, se recupera $n!$.

## Errores comunes

- **Dividir entre el número de letras repetidas en lugar de sus factoriales.** Para PAPAYA no se divide entre $3 \cdot 2 = 6$, sino entre $3! \cdot 2! = 12$.
- **Dividir cuando las clases no tienen el mismo tamaño.** El truco de contar de más y dividir exige que cada objeto se haya contado el mismo número de veces.
- **Confundir con permutaciones con reemplazo.** Las palabras de longitud 4 con letras A y B, repitiendo libremente, son $2^4 = 16$; las permutaciones de AABB son solo 6.

## Conexiones

La fórmula corrige el conteo de [[permutaciones]] cuando hay objetos idénticos, agrupando ordenaciones en clases como en [[relaciones-y-relaciones-de-equivalencia]]. Con dos tipos de objetos da el [[coeficiente-binomial]], y en general es el [[coeficiente-multinomial]]. En probabilidad, es el factor que aparece en la distribución multinomial al contar las secuencias de ensayos con un número fijo de resultados de cada tipo.
